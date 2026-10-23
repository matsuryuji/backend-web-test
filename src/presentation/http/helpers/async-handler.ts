import { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncRequestHandler = (req: Request, res: Response) => Promise<void>;

export function asyncHandler(handler: AsyncRequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res).catch(next);
  };
}
