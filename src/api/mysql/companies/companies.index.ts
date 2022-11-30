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
router.get(`/playercompany`, getPlayerCompany);
router.get(`/:id`, getCompany);
//POST
router.post("/", addCompany);
//PUT
router.put(`/playercompany`, editPlayerCompany);
router.put(`/:id`, editCompany);
//DELETE
router.delete(`/:id`, deleteCompany);

export default router;
