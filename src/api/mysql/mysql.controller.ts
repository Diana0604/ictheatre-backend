//types
import { Request, Response } from "express";
//database
import { cleanDB } from "../../mysql/mysql.wrapper";
import {
  getAllCompanies,
  getCompanyInformation,
  getShowStatus,
  getPlayerCompanyInformation,
  seedDB,
  editCompanyInformation,
} from "../../mysql/mysql.manager";
import { Company } from "../../objects/Company";

/**
 * Restart database:
 * If show is running -> won't restart
 * 1. cleanDB -> create new empty database
 * 2. seedDB -> seedDB with fixtures
 */
export const restartDB = async (_req: Request, res: Response) => {
  try {
    const showStatus = await getShowStatus();
    if (showStatus.isPlaying) {
      res
        .status(401)
        .json({ message: "show is currently playing, cannot restart DB" });
      return;
    }
    await cleanDB();
    //seed database
    await seedDB();
    res.status(200).json({ message: "database seeded" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error restarting database - check server logs" });
    console.log("error creating database");
    console.log(error);
  }
};

/**
 * Get list of companies and their shares information
 * @param _req
 * @param res
 */
export const getCompaniesList = async (_req: Request, res: Response) => {
  try {
    const companiesList = await getAllCompanies();
    res.status(200).json(companiesList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "error getting companies - check server logs" });
    console.log("error getting companies list");
    console.log(error);
  }
};

/**
 * Get information for one company and its shares
 * @param req
 * @param res
 */
export const getCompany = async (req: Request, res: Response) => {
  const companyId = req.params.id;
  try {
    const companyInformation = await getCompanyInformation(companyId);
    res.status(200).json(companyInformation);
  } catch (error) {
    res.status(500).json({
      message: "error getting company information - check server logs",
    });
    console.log(`error getting company information for id: ${companyId}`);
    console.log(error);
  }
};

/**
 * Get information for player company
 * @param req
 * @param res
 */
export const getPlayerCompany = async (req: Request, res: Response) => {
  try {
    const playerCompany = await getPlayerCompanyInformation();
    res.status(200).json(playerCompany);
  } catch (error) {
    res.status(500).json({
      message: "error getting player company information - check server logs",
    });
    console.log("error getting player company information");
    console.log(error);
  }
};

/**
 * Request to edit one single company given id
 * @param req
 * @param res
 */
export const editCompany = async (req: Request, res: Response) => {
  try {
    const newCompany = req.query;
    newCompany.id = req.params.id;
    const playerCompany = await editCompanyInformation(
      newCompany as unknown as Company
    );
    res.status(200).json(playerCompany);
  } catch (error) {
    res
      .status(500)
      .json({ message: `error editting company ${req.params.id}` });
    console.log(error);
  }
};
