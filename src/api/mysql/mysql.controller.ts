//types
import { Request, Response } from "express";
import {
  getAllCompanies,
  getCompanyInformation,
  getShowStatus,
  getPlayerCompanyInformation,
  resetDB,
  editCompanyInformation,
  deleteCompanyFromDatabase,
  getAllSellers,
  getAllPlayerBundles,
  editSellerInformation,
  editShareBundleInformation,
  deleteSellerFromDatabase,
  sellShareBundle,
  buyShareBundle,
  editPlayerCompanyInformation,
  addSellerToDatabase,
  addCompanyToDatabase,
  buyPlayerShareBundle,
  sellPlayerShareBundle,
} from "../../mysql/mysql.manager";
import { Company } from "../../objects/Company";
import { Seller } from "../../objects/Seller";
import { PlayerCompany } from "../../objects/PlayerCompany";
import { ISellerProperties, IShareBundle } from "../../types/types.objects";

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
    
    //seed database
    await resetDB();
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

export const createCompany = async (req: Request, res: Response) => {
  try {
    const newCompany = req.query;
    newCompany.id = req.params.id;
    await addCompanyToDatabase(newCompany as unknown as Company);
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

export const editPlayerCompany = async (req: Request, res: Response) => {
  try {
    const newPlayerCompany = req.query;
    await editPlayerCompanyInformation(
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
    const company = await editCompanyInformation(
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

export const getPlayerBundles = async (_req: Request, res: Response) => {
  try {
    const playerBundles = await getAllPlayerBundles();
    res.status(200).json(playerBundles);
  } catch (error) {
    res.status(500).json({ message: `error getting sellers list` });
    console.log(error);
  }
}

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

export const createSeller = async (req: Request, res: Response) => {
  try {
    const newSeller = req.query;
    addSellerToDatabase(newSeller as unknown as ISellerProperties);
    res.status(200).json({ message: `success ading seller` });
  } catch (error) {
    res.status(500).json({ message: `error adding new seller` });
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
    let parsedQuery: any = {};
    for (const key in req.query) {
      parsedQuery[key] = parseInt(req.query[key] as unknown as string);
    }
    const shareBundle = await editShareBundleInformation(
      parsedQuery as unknown as IShareBundle
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
 * sell shares from seller to original company
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
      return;
    }

    if (!query.id || !query.ownerId || !query.quantity || !query.companyId) {
      res.status(400).json({ message: `missing bundle information` });
      return;
    }
    await sellShareBundle(
      query.id,
      query.companyId,
      parseInt(query.quantity),
      query.priceAtSale
    );

    res.status(200).json({ message: `transfer succeessfull` });
  } catch (error) {
    res.status(500).json({ message: `error editing seller ${req.params.id}` });
    console.log(error);
  }
};

export const sellPlayerShares = async (req: Request, res: Response) => {
  try {
    const query: any = req.query;
    if (!query.quantity || !query.priceAtSale) {
      res.status(400).json({
        message: `missing parameter quantity OR priceAtSale in query`,
      });
      return;
    }

    if (!query.id || !query.quantity || !query.companyId) {
      res.status(400).json({ message: `missing bundle information` });
      return;
    }
    await sellPlayerShareBundle(
      query.id,
      parseInt(query.quantity),
      query.priceAtSale
    );

    res.status(200).json({ message: `transfer succeessfull` });
  } catch(error) {
    res.status(500).json({ message: `error editing bundle for company ${req.params.id}` });
    console.log(error);
  }
}

/**
 * buy shares from original company to seller
 * @param req
 * @param res
 */
export const buyShares = async (req: Request, res: Response) => {
  try {
    const query: any = req.query;
    if (!query.quantity || !query.priceAtSale) {
      res.status(400).json({
        message: `missing parameter quantity OR priceAtSale in query`,
      });
      return;
    }

    if (!query.id || !query.ownerId || !query.quantity || !query.companyId) {
      res.status(400).json({ message: `missing bundle information` });
      return;
    }
    await buyShareBundle(
      query.id,
      query.companyId,
      parseInt(query.quantity),
      query.priceAtSale
    );

    res.status(200).json({ message: `transfer succeessfull` });
  } catch (error) {
    res.status(500).json({ message: `error editing seller ${req.params.id}` });
    console.log(error);
  }
};

export const buyPlayerShares = async (req: Request, res: Response) => {
  try {
    const query: any = req.query;
    if (!query.quantity || !query.priceAtSale) {
      res.status(400).json({
        message: `missing parameter quantity OR priceAtSale in query`,
      });
      return;
    }

    if (!query.id || !query.quantity || !query.companyId) {
      res.status(400).json({ message: `missing bundle information` });
      return;
    }
    await buyPlayerShareBundle(
      query.id,
      parseInt(query.quantity),
      query.priceAtSale
    );

    res.status(200).json({ message: `transfer succeessfull` });
  } catch(error) {
    res.status(500).json({ message: `error editing bundle for company ${req.params.id}` });
    console.log(error);
  }
}
