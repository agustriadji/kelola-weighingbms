// Request context untuk pass user info ke service layer
export interface RequestContext {
  user?: {
    id: number;
    username: string;
    role: string;
    permissions: string[];
  };
}

// Global context storage (per request)
const contextStorage = new Map<string, RequestContext>();

export const setRequestContext = (requestId: string, context: RequestContext) => {
  contextStorage.set(requestId, context);
};

export const getRequestContext = (requestId?: string): RequestContext => {
  if (!requestId) return {};
  return contextStorage.get(requestId) || {};
};

export const clearRequestContext = (requestId: string) => {
  contextStorage.delete(requestId);
};

// Generate unique request ID
export const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};