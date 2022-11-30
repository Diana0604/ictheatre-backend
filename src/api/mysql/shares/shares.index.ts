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

//get
router.get(`/playerbundles`, getPlayerBundlesList);
//post
router.post(`/sell`, sellShares);
router.post(`/buy`, buyShares);
router.post(`/playersell`, sellPlayerShares);
router.post(`/playerbuy`, buyPlayerShares);
//put
router.put(`/bundle/:id`, editShareBundle);

export default router;
