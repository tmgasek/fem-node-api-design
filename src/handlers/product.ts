import { Request, Response } from "express";
import prisma from "../db";

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      products: true,
    },
  });

  res.json({ data: user.products });
};

// Get one
export const getOneProduct = async (req: Request, res: Response) => {
  // we're using middleware urlencoded to help with params
  const id = req.params.id;
  // we have to make sure this lookup is scoped only to the signed-in user
  // and it's the right id.
  // We don't have index for a combination of ID and BELONGS-TO-ID,
  // might want to add it in -- @@index([id, belongsToId]) to optimise.
  //
  // because we don't have an index, the db thinks that there might be
  // more than one product with those params passed in. So we uses findFirst()
  // If we indexed this, we can then use findUnique
  // findFirst is like array.find while findUnique is like find sth by key.
  const product = await prisma.product.findFirst({
    where: {
      id,
      belongsToId: req.user.id,
    },
  });

  res.json({ data: product });
};

export const createProduct = async (req: Request, res: Response, next) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        belongsToId: req.user.id,
      },
    });

    res.json({ data: product });
  } catch (e) {
    next(e);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  // id_belongsToId is a joint/compound index
  // we have index between id and belongsToId
  const updated = await prisma.product.update({
    where: {
      id_belongsToId: {
        id: req.params.id,
        belongsToId: req.user.id,
      },
    },
    data: {
      name: req.body.name,
    },
  });

  res.json({ data: updated });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const deleted = await prisma.product.delete({
    where: {
      id_belongsToId: {
        id: req.params.id,
        belongsToId: req.user.id,
      },
    },
  });

  res.json({ data: deleted });
};
