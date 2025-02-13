import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { isValidIpAddress } from '../utils/ipUtils';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

export class AuthService {
  static async signup({ email, password, name, ipAddress, plan = 'free' }: SignupParams) {
    try {
      // Validate IP address
      if (!isValidIpAddress(ipAddress)) {
        throw new Error('Invalid IP address');
      }

      // Check for existing user
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          plan,
          ipAddress,
        }
      });

      // Log IP account creation
      await prisma.ipAccountCreation.create({
        data: {
          ip: ipAddress
        }
      });

      // Generate token
      const token = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          plan: user.plan
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return { token, user: { ...user, password: undefined } };
    } catch {
      // Log suspicious activity if needed
      await prisma.suspiciousActivity.create({
        data: {
          ip: ipAddress,
          activity: 'failed_signup',
          details: 'Failed to signup'
        }
      });
      throw;
    }
  }

  static async login({ email, password, ipAddress }: LoginParams) {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Check for suspicious IP activity
      if (user.ipAddress !== ipAddress) {
        // Log new IP access
        await prisma.suspiciousActivity.create({
          data: {
            ip: ipAddress,
            activity: 'new_ip_login',
            details: `Previous IP: ${user.ipAddress}`
          }
        });
      }

      // Update user's IP address
      await prisma.user.update({
        where: { id: user.id },
        data: { ipAddress }
      });

      // Generate token
      const token = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          plan: user.plan
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return { token, user: { ...user, password: undefined } };
    } catch {
      // Log failed login attempts
      await prisma.suspiciousActivity.create({
        data: {
          ip: ipAddress,
          activity: 'failed_login',
          details: 'Failed to login'
        }
      });
      throw;
    }
  }

  static async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch {
      throw new Error('Invalid token');
    }
  }
}
