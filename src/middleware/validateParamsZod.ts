import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod/v4';

const validateParamsZod =
  (schema: ZodTypeAny): RequestHandler =>
  (req, res, next) => {
    const parsed = schema.safeParse(req.params);

    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => ({
        path: issue.path.join(''),
        message: issue.message,
      }));

      return res.status(400).json({
        message: issues[0]?.message ?? 'Validation failed',
        issues,
      });
    }

    req.params = parsed.data as typeof req.params;
    next();
  };

export default validateParamsZod;
