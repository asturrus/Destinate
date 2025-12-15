import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization required' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.decode(token) as { sub?: string } | null;
    
    if (!decoded || !decoded.sub) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.userId = decoded.sub;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.decode(token) as { sub?: string } | null;
    if (decoded && decoded.sub) {
      req.userId = decoded.sub;
    }
  } catch (error) {
  }
  
  next();
}
