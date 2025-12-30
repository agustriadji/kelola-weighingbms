import { NextRequest } from 'next/server';
import { getUser } from '@/utils/auth';

export interface RequestContext {
  user?: {
    id: number;
    username: string;
    fullname: string;
    role: string;
    permissions: string[];
    iat: number;
    exp: number;
  };
}

export const getRequestContext = async (request: NextRequest): Promise<RequestContext> => {
  const user = getUser(request);
  return { user: user as any };
};
