import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

declare global {
  namespace Express {
    interface Request {
      user: string | jwt.JwtPayload;
    }
  }
}

export const comparePasswords = (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password) => {
  return bcrypt.hash(password, 5);
};

export const createJWT = (user) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET
  );

  return token;
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
  // the request needs to pass in something to the authorization header
  // "bearer" describes someone having the ability to send up some type of token
  // can be API token, JWT, or access_token whatever
  // headers are sorta like the metadata of the request
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.send({ message: "Not authorised" });
    return;
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    console.log("heere");
    res.status(401);
    res.send({ message: "Malformatted Bearer token" });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);
    req.user = payload;
    next();
  } catch (e) {
    console.error(e);
    res.status(401);
    res.send("Invalid token");
    return;
  }
};
