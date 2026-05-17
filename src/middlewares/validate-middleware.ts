import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

/**
 * Simple validation middleware.
 * If the schema contains 'body', 'query', or 'params', it validates the whole request object.
 * Otherwise, it validates 'req.body' by default.
 */
export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if schema is wrapped in body/query/params
      const isWrapped = (schema as any)._def?.shape?.body || (schema as any)._def?.shape?.query || (schema as any)._def?.shape?.params;

      if (isWrapped) {
        const parsed = await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        if ((parsed as any).body !== undefined) req.body = (parsed as any).body;
        if ((parsed as any).query !== undefined) {
          Object.defineProperty(req, "query", {
            value: (parsed as any).query,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
        if ((parsed as any).params !== undefined) req.params = (parsed as any).params;
      } else {
        // Simple case: just validate the body
        req.body = await schema.parseAsync(req.body);
      }

      return next();
    } catch (error: any) {
      return next(error);
    }
  };
};