import { Request } from 'express';

export interface RefreshRequest extends Request {
  cookies: {
    refreshToken?: string;
  };
  body: {
    fingerprint: string;
  };
}
