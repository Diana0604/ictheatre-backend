import { Router } from "express";
import companies from "./companies/companies.index";
import sellers from "./sellers/sellers.index";
import shares from "./shares/shares.index";

import { restartDB, getShowStatus } from "./mysql.controller";

let router = Router();

//subroutes
router.use("/companies", companies);
router.use("/sellers", sellers);
router.use("/shares", shares);

router.get("/showstatus", getShowStatus);
router.post("/restart", restartDB);

export default router;
