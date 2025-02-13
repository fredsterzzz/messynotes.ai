import { Request, Response, NextFunction } from 'express';
import { getIpAddress } from '../utils/ipUtils';
import prisma from '../lib/prisma';

// Time window for rate limiting (24 hours in milliseconds)
const TIME_WINDOW = 24 * 60 * 60 * 1000;
// Maximum number of accounts per IP
const MAX_ACCOUNTS_PER_IP = 1;
// Maximum number of failed attempts
const MAX_FAILED_ATTEMPTS = 5;

export const ipRestrictionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = getIpAddress(req);
    
    // Check if IP is in cooldown period due to too many failed attempts
    const failedAttempts = await prisma.ipFailedAttempt.findUnique({
      where: { ip }
    });

    if (failedAttempts && failedAttempts.count >= MAX_FAILED_ATTEMPTS) {
      const cooldownEnd = new Date(failedAttempts.lastAttempt.getTime() + TIME_WINDOW);
      if (new Date() < cooldownEnd) {
        return res.status(429).json({
          error: 'Too many failed attempts. Please try again later.'
        });
      } else {
        // Reset failed attempts after cooldown
        await prisma.ipFailedAttempt.delete({
          where: { ip }
        });
      }
    }

    // For new account creation, check existing accounts from this IP
    if (req.path === '/auth/signup') {
      const existingAccounts = await prisma.user.count({
        where: {
          ipAddress: ip,
          createdAt: {
            gte: new Date(Date.now() - TIME_WINDOW)
          }
        }
      });

      if (existingAccounts >= MAX_ACCOUNTS_PER_IP) {
        // Increment failed attempts
        await prisma.ipFailedAttempt.upsert({
          where: { ip },
          update: {
            count: { increment: 1 },
            lastAttempt: new Date()
          },
          create: {
            ip,
            count: 1,
            lastAttempt: new Date()
          }
        });

        return res.status(429).json({
          error: 'Account creation limit reached for this IP address. Please upgrade to create more accounts.'
        });
      }
    }

    // Store IP in request for later use
    req.ipAddress = ip;
    next();
  } catch (error) {
    console.error('IP restriction middleware error:', error);
    next(error);
  }
};
