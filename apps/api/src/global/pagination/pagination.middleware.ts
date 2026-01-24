import { Injectable, NestMiddleware } from "@nestjs/common";
import { PaginationContext } from "./ctx/pagination.context";

@Injectable()
export class PaginationMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        PaginationContext.run(next);
    }
}