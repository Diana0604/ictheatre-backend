import { Request, Response } from "express";
import { setShowPaused, setShowStarted } from "../../mysql/mysql.manager";
import { startUpdates } from "../../functions/showUpdates";

let intervals: {
  updateSharesInterval: NodeJS.Timer;
  updateTimeInterval: NodeJS.Timer;
};
/**
 * play show from current point
 */
export const playShow = async (_req: Request, res: Response) => {
  try {
    await setShowStarted();
  } catch (error) {
    console.log("could not set show to playing");
    console.log(error);
    res
      .status(500)
      .json({ message: "error starting show - check server logs " });
    return;
  }

  try {
    intervals = await startUpdates();
  } catch (error) {
    console.log("could not load list of companies for current show");
    console.log(error);
    res
      .status(500)
      .json({ message: "error starting show - check server logs" });
    return;
  }
  res.status(200).json({ message: "OK" });
};

/**
 * pause show from current point
 */
export const pauseShow = async (_req: Request, res: Response) => {
  if (intervals) {
    clearInterval(intervals.updateSharesInterval);
    clearInterval(intervals.updateTimeInterval);
  }
  try {
    await setShowPaused();
  } catch (error) {
    console.log("could not set show to paused");
    console.log(error);
    res
      .status(500)
      .json({ message: "error pausing show - check server logs " });
    return;
  }
  res.status(200).json({ message: "OK" });
};
