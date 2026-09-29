// OPS-703 · Request logger middleware (guided skeleton).
//
// Goal: ONE structured JSON line per finished request, whatever its
// outcome. The logger module (src/logging/logger.js) already formats and
// writes lines — this middleware only decides WHEN to log and WHICH
// fields to include.
//
// TODO(OPS-703): implement the middleware. Checklist:
//   [ ] Record the start time when the request enters
//       (process.hrtime.bigint() measures monotonic time).
//   [ ] Subscribe to the response 'finish' event — the only moment the
//       final status code is known.
//   [ ] Build the fields from an explicit ALLOWLIST:
//       requestId, method, path, status, durationMs
//       ... plus userId when req.auth exists, and res.locals.errorCode
//       when the error handler set one.
//   [ ] Use logger.error with event 'request_failed' for status >= 500,
//       logger.info with event 'request_completed' otherwise.
//   [ ] Call next() immediately — logging must never delay the request.
//
// Questions before coding:
//   - Why an allowlist instead of logging the whole request object?
//   - Which header must NEVER appear in a log line? (INC brief OPS-703)
import { logger } from '../logging/logger.js';

export function requestLogger(req, res, next) {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number((process.hrtime.bigint() - startedAt) / 1_000_000n);
    const status = res.statusCode;
    const fields = {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      status,
      durationMs
    };

    if (req.auth?.userId) {
      fields.userId = req.auth.userId;
    }
    if (res.locals?.errorCode) {
      fields.errorCode = res.locals.errorCode;
    }

    const event = status >= 500 ? 'request_failed' : 'request_completed';
    const level = status >= 500 ? 'error' : 'info';
    logger[level](event, fields);
  });

  next();
}
