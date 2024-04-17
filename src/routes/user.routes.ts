import bcrypt from "bcrypt";
import { Router } from "express";
import pool from "../config/db.connection";
import generateToken from "../config/token.generate";
import authenticate from "../config/authenticate.token";

const saltround = 10;

const usersRouter = Router();

usersRouter.get("/", (request, response) => {
	return response.json("OK");
});

usersRouter.get("/all", authenticate, (req, res) => {
	pool.getConnection((err, conn) => {
		if (err) {
			console.log("Entered into error");
			console.log(err);
			res.send({
				success: false,
				statusCode: 500,
				message: "Getting error during the connection",
			});
			return;
		}

		console.log(`The id: ${req.params.id}`);

		conn.query("SELECT * FROM register", (err, rows) => {
			if (err) {
				conn.release();
				return res.send({
					success: false,
					statusCode: 400,
				});
			}

			res.send({
				message: "Success",
				statusCode: 200,
				data: rows,
			});

			conn.release();
		});
	});
});

usersRouter.get("/details/:id", authenticate, (req, res) => {
	pool.getConnection((err, conn) => {
		if (err) {
			console.log("Entered into error");
			console.log(err);
			res.send({
				success: false,
				statusCode: 500,
				message: "Getting error during the connection",
			});
			return;
		}

		console.log(`The id: ${req.params.id}`);

		conn.query(
			"SELECT * FROM actor WHERE actor_id=?",
			[req.params.id],
			(err, rows) => {
				if (err) {
					conn.release();
					return res.send({
						success: false,
						statusCode: 400,
					});
				}

				res.send({
					message: "Success",
					statusCode: 200,
					data: rows,
				});

				conn.release();
			},
		);
	});
});

usersRouter.post("/register", (req, res) => {
	pool.getConnection((err, conn) => {
		if (err) {
			console.log("Entered into error");
			console.log(err);
			res.send({
				success: false,
				statusCode: 500,
				message: "Getting error during the connection",
			});
			return;
		}

		bcrypt.hash(req.body.password, saltround, (error, hash) => {
			if (error) {
				return res.send({
					success: false,
					statusCode: 500,
					message: "Getting error during the connection",
				});
			}

			console.log("line 91");
			console.log(req.body);
			const sqlQuery = "call registeruser(?,?,?)";
			conn.query(
				sqlQuery,
				[req.body.email, req.body.phone, hash],
				(err, rows) => {
					if (err) {
						conn.release();
						return res.send({
							success: false,
							statusCode: 400,
						});
					}
					console.log("line 100");
					console.log(req.body);

					res.send({
						message: "Success",
						statusCode: 200,
					});

					conn.release();
				},
			);
		});
	});
});

usersRouter.post("/login", (req, res) => {
	pool.getConnection((err, conn) => {
		if (err) {
			console.log("Entered into error");
			console.log(err);
			res.send({
				success: false,
				statusCode: 500,
				message: "Getting error during the connection",
			});
			return;
		}

		conn.query(
			"SELECT password FROM register WHERE email=?",
			[req.body.email],
			(err, rows) => {
				if (err) {
					conn.release();
					return res.send({
						success: false,
						statusCode: 400,
						data: err,
					});
				}

				const hash = rows[0].password;
				console.log(hash);
				bcrypt.compare(req.body.password, hash, (err, result) => {
					if (err) {
						return res.send({
							message: "failed",
							statusCode: 500,
							data: err,
						});
					}

					if (result) {
						res.send({
							message: "Success",
							statusCode: 200,
							data: { token: generateToken(req.body.email) },
						});
					} else {
						res.send({
							message: "failed",
							statusCode: 500,
							data: err,
						});
					}

					conn.release();
				});
			},
		);
	});
});

export default usersRouter;
