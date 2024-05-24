import express, { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

export const authRouter: Router = express.Router();

authRouter.get(
	"/google",
	passport.authenticate("google", { scope: ["openid", "profile", "email"] }),
);

authRouter.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	(req: Request, res: Response) => {
		try {
			const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET!, {
				expiresIn: "1h",
			});

			res.redirect(`http://localhost:5173/redirect/token=${encodeURI(token)}`);
		} catch (error) {
			console.log(error);
			res.redirect("http://localhost:5173/login");
		}
	},
);

authRouter.get("/logout", (req: Request, res: Response, next: NextFunction) => {
	req.logout(function (err) {
		if (err) return next(err);
		res.redirect("/");
	});
});
