import { Router } from "express";
import {
  getSellersList,
  editSeller,
  deleteSeller,
  addSeller,
  getSellerBundles
} from "./sellers.controller";

let router = Router();

router.get(`/`, getSellersList);
router.post(`/`, addSeller);
router.get("/:id/shares", getSellerBundles);
router.put(`/:id`, editSeller);
router.delete(`/:id`, deleteSeller);

export default router;
