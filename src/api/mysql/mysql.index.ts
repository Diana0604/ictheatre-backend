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
  createSeller,
  createCompany,
  sellPlayerShares,
  buyPlayerShares,
  getPlayerBundles,
} from "./mysql.controller";

let router = Router();

router.post("/restart", restartDB);
//player company
router.get(`/playercompany`, getPlayerCompany);
router.put(`/playercompany`, editPlayerCompany);
//companies with shares available for trading
router.get("/companies", getCompaniesList);
router.post("/companies", createCompany);
router.get(`/companies/:id`, getCompany);
router.put(`/companies/:id`, editCompany);
router.delete(`/companies/:id`, deleteCompany);
//sellers and shares
router.get(`/sellers`, getSellersList);
router.post(`/sellers`, createSeller);
router.put(`/sellers/:id`, editSeller);
router.delete(`/sellers/:id`, deleteSeller);
router.put(`/shareBundle/:id`, editShareBundle);
router.get(`/playerbundles`, getPlayerBundles)
//sell shares during show
router.put(`/sellshares`, sellShares);
router.put(`/buyshares`, buyShares);
router.put(`/sellplayershares`, sellPlayerShares);
router.put(`/buyplayershares`, buyPlayerShares);

export default router;
