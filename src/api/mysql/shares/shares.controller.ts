//types
import { Request, Response } from "express";
import {
  isExistingPlayerShareBundle,
  isExistingShareBundle,
  isShareBundle,
} from "../../../functions/objectChecker";
import {
  editShareBundleInDB,
  sellSharesInDB,
  sellPlayerSharesInDB,
  buySharesInDB,
  buyPlayerSharesInDB,
  getPlayerBundlesListFromDB,
} from "../../../mysql/sharebundles/sharebundles.manager";
import { IShareBundle } from "../../../types/types.objects";

//================================== GET REQUESTS ==============================
/**
 * get bundles lists just for player
 * @param _req
 * @param res
 */
export const getPlayerBundlesList = async (_req: Request, res: Response) => {
  try {
    const playerBundles = await getPlayerBundlesListFromDB();
    res.status(200).json(playerBundles);
  } catch (error) {
    res.status(500).json({ message: `error getting sellers list` });
    console.log(error);
  }
};

//================================== POST REQUESTS (create) ==========================
/**
 * sell shares from seller to original company
 * @param req
 * @param res
 */
export const sellShares = async (req: Request, res: Response) => {
  try {
    const query: any = req.query;
    //check we have quantity to sell and price at sale
    if (!query.quantity || !query.priceAtSale) {
      res.status(400).json({
        message: `missing parameter quantity OR priceAtSale in query`,
      });
      return;
    }
    //check rest of share bundles elements exist
    if (!isExistingShareBundle(query)) {
      res.status(400).json({ message: `missing bundle information` });
      return;
    }
    await sellSharesInDB(
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
    //check it has properties necessary for sale
    const query: any = req.query;
    if (!query.quantity || !query.priceAtSale) {
      res.status(400).json({
        message: `missing parameter quantity OR priceAtSale in query`,
      });
      return;
    }
    //check it has all the properties for player
    if (!isExistingPlayerShareBundle(query)) {
      res.status(400).json({ message: `missing bundle information` });
      return;
    }
    await sellPlayerSharesInDB(
      query.id,
      parseInt(query.quantity),
      query.priceAtSale
    );

    res.status(200).json({ message: `transfer succeessfull` });
  } catch (error) {
    res
      .status(500)
      .json({ message: `error editing bundle for company ${req.params.id}` });
    console.log(error);
  }
};

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

    if (!isExistingShareBundle(query)) {
      res.status(400).json({ message: `missing bundle information` });
      return;
    }
    await buySharesInDB(
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

/**
 * Buy shares for player
 * @param req
 * @param res
 * @returns
 */
export const buyPlayerShares = async (req: Request, res: Response) => {
  try {
    const query: any = req.query;
    if (!query.quantity || !query.priceAtSale) {
      res.status(400).json({
        message: `missing parameter quantity OR priceAtSale in query`,
      });
      return;
    }

    if (!isExistingPlayerShareBundle(query)) {
      res.status(400).json({ message: `missing bundle information` });
      return;
    }
    await buyPlayerSharesInDB(
      query.id,
      parseInt(query.quantity),
      query.priceAtSale
    );

    res.status(200).json({ message: `transfer succeessfull` });
  } catch (error) {
    res
      .status(500)
      .json({ message: `error editing bundle for company ${req.params.id}` });
    console.log(error);
  }
};

// ================================ PUT REQUESTS (edit) ===========================
/**
 * Request to edit share bundle given an id
 * @param req
 * @param res
 */
export const editShareBundle = async (req: Request, res: Response) => {
  try {
    const newBundle = req.query;
    if (!isShareBundle(newBundle)) {
      res.json(400);
      return;
    }
    const shareBundle = await editShareBundleInDB(
      newBundle as unknown as IShareBundle
    );
    res.status(200).json(shareBundle);
  } catch (error) {
    res
      .status(500)
      .json({ message: `error editing share bundle ${req.params.id}` });
    console.log(error);
  }
};
