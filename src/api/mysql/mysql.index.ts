import { Router } from "express";
import companies from "./companies/companies.index";
import sellers from "./sellers/sellers.index";

import {
  restartDB,
  editShareBundle,
  sellShares,
  buyShares,
  sellPlayerShares,
  buyPlayerShares,
  getPlayerBundles,
} from "./mysql.controller";

let router = Router();

//subroutes
router.use("/companies", companies);
router.use("/sellers", sellers);

router.post("/restart", restartDB);
//shares
router.put(`/shareBundle/:id`, editShareBundle);
router.get(`/playerbundles`, getPlayerBundles);
//sell shares during show
router.put(`/sellshares`, sellShares);
router.put(`/buyshares`, buyShares);
router.put(`/sellplayershares`, sellPlayerShares);
router.put(`/buyplayershares`, buyPlayerShares);

export default router;
