import { Express, Request } from 'express'

interface IContext {
  clientKey: string
}

interface RequestContext extends Request {
  context: IContext
}

declare module 'express-serve-static-core' {
    interface Request {
      context: IContext
    }
}
