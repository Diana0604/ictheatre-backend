import { Router } from "express";

import {
  getCompaniesList,
  getCompany,
  getPlayerCompany,
  editCompany,
  deleteCompany,
  editPlayerCompany,
  addCompany,
} from "./companies.controller";

let router = Router();

//GET
router.get("/", getCompaniesList); //won't return player company
router.get(`/:id`, getCompany);
router.get(`/playercompany`, getPlayerCompany);
//POST
router.post("/", addCompany);
//PUT
router.put(`/:id`, editCompany);
router.put(`/playercompany`, editPlayerCompany);
//DELETE
router.delete(`/:id`, deleteCompany);

export default router;
