// ============================================================================
// STARTER NOTE — Station 5.
//
// Authentication middleware: establishes WHO the actor is, nothing more.
// What the actor may DO is authorization and lives in the module policies.
//
// Contract:
//   * read the Authorization header; require exactly the Bearer scheme
//     ("Basic ...", a bare token or an empty Bearer are not identities)
//     -> AppError('auth', 'AUTHENTICATION_REQUIRED', ...);
//   * verify the token with verifyToken (never just decode it);
//     any verification failure (altered, expired, wrong issuer/audience)
//     -> AppError('auth', 'INVALID_TOKEN', ...) — one same answer, the
//     response never explains which check failed;
//   * on success, build the ONLY trusted source of identity:
//       req.auth = { userId: payload.sub, role: payload.role }
//     and call next().
//
// Errors are answered here with respondError (middlewares do not reach the
// router's try/catch).
// ============================================================================
import { AppError } from '../app-error.js';
import { respondError } from '../http/respond-error.js';
import { verifyToken } from '../modules/auth/token.js';

export async function authenticate(req, res, next) {
  const authHeader = req.get('Authorization');

  if (typeof authHeader !== 'string' || authHeader.length === 0) {
    return respondError(
      res,
      new AppError('auth', 'AUTHENTICATION_REQUIRED', 'Authentication is required.')
    );
  }

  const match = authHeader.match(/^Bearer\s+(.+)$/);
  if (!match) {
    return respondError(
      res,
      new AppError('auth', 'AUTHENTICATION_REQUIRED', 'Authentication is required.')
    );
  }

  const token = match[1];

  try {
    const payload = await verifyToken(token);
    const userId = payload.sub;
    const role = payload.role;

    if (typeof userId !== 'string' || typeof role !== 'string') {
      throw new AppError('auth', 'INVALID_TOKEN', 'The token is invalid or expired.');
    }

    req.auth = { userId, role };
    return next();
  } catch (error) {
    if (error instanceof AppError) {
      return respondError(res, error);
    }

    return respondError(
      res,
      new AppError('auth', 'INVALID_TOKEN', 'The token is invalid or expired.')
    );
  }
}
