import { Router } from "express";

import {
  restartDB,
  getCompaniesList,
  getCompany,
  getPlayerCompany,
  editCompany,
  deleteCompany,
  getSellersList,
  editSeller,
  editShareBundle,
} from "./mysql.controller";

let router = Router();

router.post("/restart", restartDB);
//player company
router.get(`/playercompany`, getPlayerCompany);
//companies with shares available for trading
router.get("/companies", getCompaniesList);
router.get(`/companies/:id`, getCompany);
router.put(`/company/:id`, editCompany);
router.delete(`/company/:id`, deleteCompany);
//sellers and shares
router.get(`/sellers`, getSellersList);
router.put(`/sellers/:id`, editSeller);
router.put(`/shareBundle/:id`, editShareBundle);

export default router;
