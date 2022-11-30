import { Router } from "express";
import {
  getSellersList,
  editSeller,
  deleteSeller,
  addSeller,
} from "./sellers.controller";

let router = Router();

router.get(`/`, getSellersList);
router.post(`/`, addSeller);
router.put(`/:id`, editSeller);
router.delete(`/:id`, deleteSeller);

export default router;
