//types
import { Request, Response } from "express";
import { isExistingSeller, isSeller } from "../../../functions/objectChecker";
import {
  getSellersListFromDB,
  editSellerInDB,
  addSellerToDB,
  deleteSellerFromDB,
} from "../../../mysql/sellers/sellers.manager";
import { ISellerProperties } from "../../../types/types.objects";

/**
 * Get list of sellers and their shares information. Will also return sharebundles -> for now like this we'll see in future.
 * @param _req
 * @param res
 */
export const getSellersList = async (_req: Request, res: Response) => {
  try {
    const sellersList = await getSellersListFromDB();
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
    if (!isExistingSeller(newSeller)) {
      res.status(400).json({ message: `missing parameters from seller` });
      return;
    }
    const seller = await editSellerInDB(
      newSeller as unknown as ISellerProperties
    );
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: `error editing seller ${req.params.id}` });
    console.log(error);
  }
};

/**
 * Add new seller to database
 * @param req
 * @param res
 * @returns
 */
export const addSeller = async (req: Request, res: Response) => {
  try {
    const newSeller = req.query;
    if (!isSeller(newSeller)) {
      res.status(400).json({ message: `missing parameters from seller` });
      return;
    }
    addSellerToDB(newSeller as unknown as ISellerProperties);
    res.status(200).json({ message: `success ading seller` });
  } catch (error) {
    res.status(500).json({ message: `error adding new seller` });
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
    const seller = await deleteSellerFromDB(req.params.id);
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: `error editing seller ${req.params.id}` });
    console.log(error);
  }
};
