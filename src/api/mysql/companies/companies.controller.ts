//types
import { Request, Response } from "express";
import { isCompany, isExistingCompany, isExistingPlayerCompany } from "../../../functions/objectChecker";
import {
  addCompanyToDB,
  deleteCompanyFromDB,
  editCompanyInDB,
  editPlayerCompanyInDB,
  getCompaniesListFromDB,
  getCompanyFromDB,
  getPlayerCompanyFromDB,
} from "../../../mysql/companies/companies.manager";
import { Company } from "../../../objects/Company";
import { PlayerCompany } from "../../../objects/PlayerCompany";

/**
 * Get list of companies and their shares information. WARNING: won't return player company
 * @param _req
 * @param res
 */
export const getCompaniesList = async (_req: Request, res: Response) => {
  try {
    const companiesList = await getCompaniesListFromDB();
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
 * Add new company to database
 * @param req
 * @param res
 * @returns
 */
export const addCompany = async (req: Request, res: Response) => {
  try {
    //check query contains proper parameters for a company
    const newCompany = req.query;
    if (!isCompany(req.query)) {
      res
        .status(400)
        .json({ message: `Missing required paramater for adding new company` });
      return;
    }
    //add company to database
    await addCompanyToDB(newCompany as unknown as Company);
    res.status(200).json({ message: "success creating company" });
  } catch (error) {
    res.status(500).json({ message: `error creating company` });
    console.log("error creating company");
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
    const companyInformation = await getCompanyFromDB(companyId);
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
    const playerCompany = await getPlayerCompanyFromDB();
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
 * Edit information for player company
 * @param req 
 * @param res 
 */
export const editPlayerCompany = async (req: Request, res: Response) => {
  try {
    const newPlayerCompany = req.query;
    if(!isExistingPlayerCompany(newPlayerCompany)) {
      res.status(400).json({message: `missing some parameters to add player company`})
      return;
    }
    await editPlayerCompanyInDB(
      newPlayerCompany as unknown as PlayerCompany
    );
    res.status(200).json({ message: `successfully updated player company` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error editing player company information" });
    console.log("error editing player company information");
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
    if(!isExistingCompany(newCompany)) {
      res.status(400).json(`missing some parameters of company`)
      return;
    }
    const company = await editCompanyInDB(
      newCompany as unknown as Company
    );
    res.status(200).json(company);
  } catch (error) {
    res
      .status(500)
      .json({ message: `error editting company ${req.params.id}` });
    console.log(error);
  }
};

/**
 * Request to delete company given id
 * @param req
 * @param res
 */
export const deleteCompany = async (req: Request, res: Response) => {
  try {
    await deleteCompanyFromDB(req.params.id);
    res.status(200).json({ message: `company deleted!` });
  } catch (error) {
    res
      .status(500)
      .json({ message: `error deleting company ${req.params.id}` });
    console.log(error);
  }
};
