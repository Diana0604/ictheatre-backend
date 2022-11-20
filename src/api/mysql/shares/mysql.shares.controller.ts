//types
import { Request, Response } from "express";

export const buyShares = async (req: Request, res: Response) => {
  res
    .status(501)
    .json({ message: `Method not implemented yet ${req.params.id}` });
};

