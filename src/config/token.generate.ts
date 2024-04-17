import { config } from "dotenv";
import { sign } from "jsonwebtoken";

config();

// biome-ignore lint/suspicious/noExplicitAny:
const generateToken = (user: any) => {
	const tokenSecret = "my-token-secret";
	return sign({ data: user }, tokenSecret, {
		expiresIn: process.env.EXPIRESIN,
	});
};

export default generateToken;
