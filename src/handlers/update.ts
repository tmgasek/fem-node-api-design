import { Request, Response } from "express";
import prisma from "../db";

export const getOneUpdate = async (req: Request, res: Response) => {
  const update = await prisma.update.findUnique({
    where: {
      id: req.params.id,
    },
  });

  res.json({ data: update });
};

export const getUpdates = async (req: Request, res: Response) => {
  // do we get all update for a single user (spanning different products?)
  // or do we get all updates for a particular product
  // for now, we'll just get all updates for signed in user (not best)

  //
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  // This is bad. If you have to do this after coming out of a db call,
  // something's not right. I don't have the appropriate schema set up
  // to get the data I need. This is a problem with REST, where we're trying
  // to make things so generic, that you sacrifice optimal querying
  // You want to avoid putting things in memory like this, and have the DB
  // get the data out for you more optimally. It's common to see this kind
  // of problem and realise you have to go back and change the schema.
  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  res.json({ data: updates });
};

export const createUpdate = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.body.productId,
    },
  });

  if (!product) {
    // does not belong to user
    res.json({ message: "nope" });
  }

  const update = await prisma.update.create({
    // req.body already got validated by middleware so we can trust it.
    // we can just do data:req.body, it contains the fields we need (look at prisma schema)
    data: {
      title: req.body.title,
      body: req.body.body,
      product: {
        connect: { id: product.id },
      },
    },
  });

  res.json({ data: update });
};

export const updateUpdate = async (req: Request, res: Response) => {
  // you as user own a product that has an update with that Id
  // There is a better way of doing this with prisma
  // doing this with JS is pretty bad...
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  const match = updates.find((update) => update.id === req.params.id);

  if (!match) {
    // handle this
    res.json({ message: "nope" });
  }

  const updatedUpdate = await prisma.update.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });

  res.json({ data: updatedUpdate });
};

export const deleteUpdate = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  const match = updates.find((update) => update.id === req.params.id);

  if (!match) {
    // handle this
    res.json({ message: "nope" });
  }

  const deleted = await prisma.update.delete({
    where: {
      id: req.params.id,
    },
  });

  res.json({ data: deleted });
};
