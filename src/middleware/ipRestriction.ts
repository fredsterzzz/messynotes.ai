import { Request, Response, NextFunction } from 'express';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

interface RequestWithIp extends Request {
  ipAddress?: string;
}

interface IpLimitData {
  count: number;
  lastReset: Date;
}

const REQUESTS_PER_HOUR = 100;

export async function checkIpLimit(req: RequestWithIp, res: Response, next: NextFunction) {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  // Skip IP check for authenticated users
  if (user) {
    return next();
  }

  // Get IP address from request
  const ip = req.ip || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress || 
             req.headers['x-forwarded-for']?.toString();

  if (!ip) {
    return res.status(400).json({ error: 'Could not determine IP address' });
  }

  req.ipAddress = ip;

  try {
    const ipRef = doc(db, 'ipLimits', ip);
    const ipDoc = await getDoc(ipRef);
    const now = new Date();

    if (!ipDoc.exists()) {
      // First request from this IP
      await setDoc(ipRef, {
        count: 1,
        lastReset: now
      });
      return next();
    }

    const data = ipDoc.data() as IpLimitData;
    const lastReset = data.lastReset.toDate();
    const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);

    if (hoursSinceReset >= 1) {
      // Reset counter if an hour has passed
      await setDoc(ipRef, {
        count: 1,
        lastReset: now
      });
      return next();
    }

    if (data.count >= REQUESTS_PER_HOUR) {
      return res.status(429).json({
        error: 'Too many requests from this IP. Please try again later or sign in.'
      });
    }

    // Increment counter
    await setDoc(ipRef, {
      count: data.count + 1,
      lastReset: data.lastReset
    });

    next();
  } catch (error) {
    console.error('Error checking IP limit:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
