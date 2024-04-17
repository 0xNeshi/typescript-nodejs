import type { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;
	if (!token) {
		res.send({
			success: false,
			statusCode: 401,
			message: "not token found or invalid token!!",
		});
	} else {
		const tokenSecret = "my-token-secret";
		// biome-ignore lint/suspicious/noExplicitAny:
		Jwt.verify(token.split(" ")[1], tokenSecret, (err, value: any) => {
			if (err) {
				res.send({
					success: false,
					statusCode: 401,
					message: "invalid token!",
				});
			} else {
				// biome-ignore lint/suspicious/noExplicitAny:
				(<any>req).user = value.data;
				// biome-ignore lint/suspicious/noExplicitAny:
				console.log((<any>req).user);
				next();
			}
		});
	}
};

export default authenticate;
