import { Request, Response, Router } from "express";

const router = Router();

/*
 * Product
 */
router.get("/product", (req: Request, res: Response) => {
  res.json({ message: "hi product" });
});
router.get("/product/:id", (req: Request, res: Response) => {});
router.put("/product/:id", (req: Request, res: Response) => {});
router.post("/product", (req: Request, res: Response) => {});
router.delete("/product/:id", (req: Request, res: Response) => {});

/*
 * Updates
 */
router.get("/update", (req: Request, res: Response) => {});
router.get("/update/:id", (req: Request, res: Response) => {});
router.put("/update/:id", (req: Request, res: Response) => {});
router.post("/update", (req: Request, res: Response) => {});
router.delete("/update/:id", (req: Request, res: Response) => {});

/*
 * Update Point
 */
router.get("/updatepoint", (req: Request, res: Response) => {});
router.get("/updatepoint/:id", (req: Request, res: Response) => {});
router.put("/updatepoint/:id", (req: Request, res: Response) => {});
router.post("/updatepoint", (req: Request, res: Response) => {});
router.delete("/updatepoint/:id", (req: Request, res: Response) => {});

export default router;
