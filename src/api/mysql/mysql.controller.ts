//types
import { Request, Response } from "express";
import {
  getShowStatusFromDB,
  resetDB,
} from "../../mysql/mysql.manager";

/**
 * Restart database:
 * If show is running -> won't restart
 * 1. cleanDB -> create new empty database
 * 2. seedDB -> seedDB with fixtures
 */
export const restartDB = async (_req: Request, res: Response) => {
  try {
    const showStatus = await getShowStatusFromDB();
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

export const getShowStatus = async (_req: Request, res: Response) => {
  try {
    const showStatus = await getShowStatusFromDB();
    res.status(200).json(showStatus);
  } catch (error) {
    res
      .status(500)
      .json({ message: "error restarting database - check server logs" });
    console.log("error creating database");
    console.log(error);
  }
};
