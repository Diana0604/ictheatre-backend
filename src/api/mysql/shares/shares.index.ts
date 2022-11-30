import { Router } from "express";

import {
  editShareBundle,
  sellShares,
  buyShares,
  sellPlayerShares,
  buyPlayerShares,
  getPlayerBundlesList,
} from "./shares.controller";

let router = Router();

//shares
router.put(`/bundle/:id`, editShareBundle);
router.get(`/playerbundles`, getPlayerBundlesList);
//sell shares during show
router.post(`/sell`, sellShares);
router.post(`/buy`, buyShares);
router.post(`/playersell`, sellPlayerShares);
router.post(`/playerbuy`, buyPlayerShares);

export default router;
