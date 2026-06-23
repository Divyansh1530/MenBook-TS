import type { Request , Response , NextFunction } from "express"

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<unknown>

const asyncHandler =(requestHandler: AsyncRequestHandler) =>(req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(
            requestHandler(req, res, next)
        ).catch(next)
    }

export { asyncHandler }