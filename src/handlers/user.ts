import { Request, Response } from "express";
import prisma from "../db";
import { createJWT, hashPassword, comparePasswords } from "../modules/auth";

export const createNewUser = async (req: Request, res: Response, next) => {
  try {
    const hash = await hashPassword(req.body.password);
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: hash,
      },
    });

    const token = createJWT(user);
    res.json({ token });
  } catch (e) {
    // we'd probably want to inspect the (e) and return a more specific error
    e.type = "input";
    next(e);
  }
};

export const signIn = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { username: req.body.username },
  });

  const isValid = await comparePasswords(req.body.password, user.password);

  if (!isValid) {
    res.status(401);
    res.send("Invalid username or password");
    return;
  }

  const token = createJWT(user);
  res.json({ token });
};
