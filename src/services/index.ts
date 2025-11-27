// Only export functions, not classes to avoid client-side issues
export { login } from './auth.service'

// Note: Services with TypeORM should only be used in API routes
// Client components should use API calls instead