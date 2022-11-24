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
  deleteSeller,
  sellShares,
  buyShares,
  editPlayerCompany,
} from "./mysql.controller";

let router = Router();

router.post("/restart", restartDB);
//player company
router.get(`/playercompany`, getPlayerCompany);
router.put(`/playercompany`, editPlayerCompany);
//companies with shares available for trading
router.get("/companies", getCompaniesList);
router.get(`/companies/:id`, getCompany);
router.put(`/company/:id`, editCompany);
router.delete(`/company/:id`, deleteCompany);
//sellers and shares
router.get(`/sellers`, getSellersList);
router.put(`/sellers/:id`, editSeller);
router.delete(`/sellers/:id`, deleteSeller);
router.put(`/shareBundle/:id`, editShareBundle);
//sell shares during show
router.post(`/sellshares`, sellShares);
router.post(`/buyshares`, buyShares);

export default router;
