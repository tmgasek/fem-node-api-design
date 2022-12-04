import { Request, Response, Router } from "express";
import { body, oneOf, validationResult } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getOneProduct,
  getProducts,
  updateProduct,
} from "./handlers/product";
import {
  createUpdate,
  deleteUpdate,
  getOneUpdate,
  getUpdates,
  updateUpdate,
} from "./handlers/update";
import { handleInputsErrors } from "./modules/middleware";

const router = Router();

/*
 * Product
 */
router.get("/product", getProducts);
router.get("/product/:id", getOneProduct);
router.put(
  "/product/:id",
  body("name").isString(),
  handleInputsErrors,
  updateProduct
);
router.post(
  "/product",
  body("name").isString(),
  handleInputsErrors,
  createProduct
);
router.delete("/product/:id", deleteProduct);

/*
 * Updates
 */
router.get("/update", getUpdates);
router.get("/update/:id", getOneUpdate);
router.put(
  "/update/:id",
  body("title").optional(),
  body("body").optional(),
  oneOf([
    body("status").isIn(["IN_PROGRESS", "SHIPPED", "DEPRECATED"]).optional(),
  ]),
  body("version").optional(),
  updateUpdate
);
router.post(
  "/update",
  body("title").exists().isString(),
  body("body").exists().isString(),
  body("productId").exists().isString(),
  createUpdate
);
router.delete("/update/:id", deleteUpdate);

/*
 * Update Point
 */
router.get("/updatepoint", (req: Request, res: Response) => {});
router.get("/updatepoint/:id", (req: Request, res: Response) => {});
router.put(
  "/updatepoint/:id",
  body("name").optional().isString(),
  body("description").optional().isString(),
  (req: Request, res: Response) => {}
);
router.post(
  "/updatepoint",
  body("name").optional().isString(),
  body("description").isString(),
  body("updateId").exists().isString(),
  (req: Request, res: Response) => {}
);
router.delete("/updatepoint/:id", (req: Request, res: Response) => {});

export default router;
