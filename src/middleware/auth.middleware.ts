import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

async function authMiddleware(request: Request, response: Response, next: NextFunction) {
	const authHeader = request.headers?.authorization;

	if (authHeader) {
		const token = authHeader.split(" ")[1];

		try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);
			response.locals._id = decoded._id;

            // fetch the user and verify if they have tokens.
            if (decoded.isEmailVerified && decoded.isApproved) {
                // passes auth
                next();
            } else {
                throw {"error" : "user not verified or approved to access this route."};
            }
		} catch (jwtError) {
			if (process.env.NODE_ENV === "dev-notoken") {
				// special dev mode with disabled auth
				next();
			} else {
				response.status(403).send();
			}
		}
	} else {
        response.status(403).json({"error" : "no token provided"});
    }
}

export default authMiddleware;
