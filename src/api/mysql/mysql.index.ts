import { Router } from "express";
import companies from "./companies/companies.index";

import {
  restartDB,
  getSellersList,
  editSeller,
  editShareBundle,
  deleteSeller,
  sellShares,
  buyShares,
  createSeller,
  sellPlayerShares,
  buyPlayerShares,
  getPlayerBundles,
} from "./mysql.controller";

let router = Router();
router.use("/companies", companies);

router.post("/restart", restartDB);
//sellers and shares
router.get(`/sellers`, getSellersList);
router.post(`/sellers`, createSeller);
router.put(`/sellers/:id`, editSeller);
router.delete(`/sellers/:id`, deleteSeller);
router.put(`/shareBundle/:id`, editShareBundle);
router.get(`/playerbundles`, getPlayerBundles);
//sell shares during show
router.put(`/sellshares`, sellShares);
router.put(`/buyshares`, buyShares);
router.put(`/sellplayershares`, sellPlayerShares);
router.put(`/buyplayershares`, buyPlayerShares);

export default router;
