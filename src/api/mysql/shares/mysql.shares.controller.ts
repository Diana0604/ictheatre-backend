//types
import { Request, Response } from "express";

export const buyShares = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: `company deleted!` });
  } catch (error) {
    res
      .status(500)
      .json({ message: `error deleting company ${req.params.id}` });
    console.log(error);
  }
};
