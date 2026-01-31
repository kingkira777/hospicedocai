import { Response, Request } from "express"
import Responses from "../utils/API_Responses.util"

export const NotFound = (req: Request, res: Response) => {
    return Responses._404(res, `Endpoint not found`);
}