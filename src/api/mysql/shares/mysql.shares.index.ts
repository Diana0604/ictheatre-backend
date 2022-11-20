import { Router } from "express";
import { buyShares } from "./mysql.shares.controller";

let router = Router();

router.post("/buy", buyShares);

export default router;
