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
	passport.authenticate("google", {
		failureRedirect: "/",
		successRedirect: "http://localhost:5173/redirect/1",
	}),
);

authRouter.get('/logout', (req, res,next) => {
	console.log("Outside");
	req.logout((err) => {
	  if (err) {
		return next(err);
	  }
	  req.session.destroy((err) => {
		if (err) {
		  return next(err);
		}
		console.log("Inside");
		res.clearCookie('connect.sid');
		res.redirect('http://localhost:5173'); // Redirect to your React app
	  });
	});
  });
  