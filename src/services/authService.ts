import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { isValidIpAddress } from '../utils/ipUtils';

interface SignupParams {
  email: string;
  password: string;
  name?: string;
  ipAddress: string;
  plan?: string;
}

interface LoginParams {
  email: string;
  password: string;
  ipAddress: string;
}

interface GoogleSignInParams {
  email: string;
  name: string;
  googleId: string;
  ipAddress: string;
}

export class AuthService {
  static async signup({ email, password, name, ipAddress, plan = 'free' }: SignupParams) {
    try {
      // Validate IP address
      if (!isValidIpAddress(ipAddress)) {
        throw new Error('Invalid IP address');
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          plan,
          lastLoginIp: ipAddress
        }
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '24h' }
      );

      return { user, token };
    } catch (error) {
      // Log suspicious activity if needed
      await prisma.suspiciousActivity.create({
        data: {
          ip: ipAddress,
          activity: 'failed_signup',
          details: 'Failed to signup'
        }
      });
      throw error;
    }
  }

  static async login({ email, password, ipAddress }: LoginParams) {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Validate password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Invalid password');
      }

      // Update last login IP
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginIp: ipAddress }
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '24h' }
      );

      return { user, token };
    } catch (error) {
      // Log suspicious activity
      await prisma.suspiciousActivity.create({
        data: {
          ip: ipAddress,
          activity: 'failed_login',
          details: 'Failed login attempt'
        }
      });
      throw error;
    }
  }

  static async googleSignIn({ email, name, googleId, ipAddress }: GoogleSignInParams) {
    try {
      let user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        // Create new user if doesn't exist
        user = await prisma.user.create({
          data: {
            email,
            name,
            googleId,
            lastLoginIp: ipAddress
          }
        });
      } else {
        // Update existing user's Google ID if not set
        if (!user.googleId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              googleId,
              lastLoginIp: ipAddress
            }
          });
        }
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '24h' }
      );

      return { user, token };
    } catch (error) {
      // Log suspicious activity
      await prisma.suspiciousActivity.create({
        data: {
          ip: ipAddress,
          activity: 'failed_google_signin',
          details: 'Failed Google sign in attempt'
        }
      });
      throw error;
    }
  }

  static async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
