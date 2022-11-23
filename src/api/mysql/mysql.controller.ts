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
  deleteCompanyFromDatabase,
  getAllSellers,
  editSellerInformation,
  editShareBundleInformation,
  deleteSellerFromDatabase,
  transferSharesOwnershipToPlayer,
  getPlayerSharesFromDatabase,
  transferSharesFromPlayerToCompany,
} from "../../mysql/mysql.manager";
import { Company } from "../../objects/Company";
import { Seller } from "../../objects/Seller";
import { ShareBundle } from "../../objects/ShareBundle";

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

/**
 * Request to delete company given id
 * @param req
 * @param res
 */
export const deleteCompany = async (req: Request, res: Response) => {
  try {
    await deleteCompanyFromDatabase(req.params.id);
    res.status(200).json({ message: `company deleted!` });
  } catch (error) {
    res
      .status(500)
      .json({ message: `error deleting company ${req.params.id}` });
    console.log(error);
  }
};

/**
 * Get list of sellers and their shares information
 * @param _req
 * @param res
 */
export const getSellersList = async (_req: Request, res: Response) => {
  try {
    const sellersList = await getAllSellers();
    res.status(200).json(sellersList);
  } catch (error) {
    res.status(500).json({ message: `error getting sellers list` });
    console.log(error);
  }
};

/**
 * Request to edit seller given id
 * @param req
 * @param res
 */
export const editSeller = async (req: Request, res: Response) => {
  try {
    const newSeller = req.query;
    newSeller.id = req.params.id;
    const seller = await editSellerInformation(newSeller as unknown as Seller);
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: `error editing seller ${req.params.id}` });
    console.log(error);
  }
};

/**
 * Request to edit share bundle given an id
 * @param req
 * @param res
 */
export const editShareBundle = async (req: Request, res: Response) => {
  try {
    const newShareBundle = req.query;
    newShareBundle.id = req.params.id;
    const shareBundle = await editShareBundleInformation(
      newShareBundle as unknown as ShareBundle
    );
    res.status(200).json(shareBundle);
  } catch (error) {
    res
      .status(500)
      .json({ message: `error editing share bundle ${req.params.id}` });
    console.log(error);
  }
};

/**
 * Request to delete a seller and their shares
 * @param req
 * @param res
 */
export const deleteSeller = async (req: Request, res: Response) => {
  try {
    const seller = await deleteSellerFromDatabase(req.params.id);
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: `error editing seller ${req.params.id}` });
    console.log(error);
  }
};

/**
 * sell shares from seller to player company
 * @param req
 * @param res
 */
export const sellShares = async (req: Request, res: Response) => {
  try {
    const query: any = req.query;
    if (!query.quantity || !query.priceAtSale) {
      res.status(400).json({
        message: `missing parameter quantity OR priceAtSale in query`,
      });
    }

    if (!query.id || !query.ownerId || !query.quantity || !query.companyId) {
      res.status(400).json({ message: `missing bundle information` });
    }
    await transferSharesOwnershipToPlayer(
      query.id,
      query.companyId,
      parseInt(query.quantity),
      query.priceAtSale
    );

    res.status(501);
  } catch (error) {
    res.status(500).json({ message: `error editing seller ${req.params.id}` });
    console.log(error);
  }
};

/**
 * get shares owned by player company
 */
export const getPlayerShares = async (_req: Request, res: Response) => {
  try {
    const sharesList = await getPlayerSharesFromDatabase();
    res.status(200).json(sharesList);
  } catch (error) {
    res.status(500).json({ message: `error getting sellers list` });
    console.log(error);
  }
};

/**
 * sell shares from player company back to original company
 * @param req
 * @param res
 */
export const sellPlayerShares = async (req: Request, res: Response) => {
  try {
    const query: any = req.query;
    if (!query.quantity || !query.priceAtSale) {
      res.status(400).json({
        message: `missing parameter quantity OR priceAtSale in query`,
      });
    }

    if (!query.id || !query.quantity || !query.companyId) {
      res.status(400).json({ message: `missing bundle information` });
    }
    await transferSharesFromPlayerToCompany(
      query.companyId,
      parseInt(query.quantity),
      query.priceAtSale
    );

    res.status(501);
  } catch (error) {
    res.status(500).json({ message: `error editing seller ${req.params.id}` });
    console.log(error);
  }
};
