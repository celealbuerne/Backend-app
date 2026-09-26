import { JwtPayload } from '../auth/jwtPayload.interface.js';
//archivo para tipar el request con el user

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
