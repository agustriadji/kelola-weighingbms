export const getUserFromHeader = (req: Request) => {
  const header = req.headers.get("x-user");
  return header ? JSON.parse(header) : null;
};

export const hasRole = (user: any, role: string) => {
  return user?.role === role;
};

export const hasPermission = (user: any, perm: string) => {
  return user?.permissions?.includes(perm);
};