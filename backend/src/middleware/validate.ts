import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

/**
 * Validates req.body against a zod schema. On failure, responds 422 with
 * a field-level error list. On success, replaces req.body with the parsed
 * (and defaulted/coerced) data.
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({
        error: 'ValidationError',
        message: 'One or more fields are invalid.',
        details: result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }
    req.body = result.data;
    next();
  };
}
