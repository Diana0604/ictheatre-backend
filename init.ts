import config from "./src/config/config.index";
import { seedDB, setShowPaused } from "./src/mysql/mysql.manager";
import { init as initDB } from "./src/mysql/mysql.wrapper";

/**
 * Init all processes:
 * 1. Init Database and seed if necessary
 * 2. Set show as paused
 */
export default async () => {
  if (!initDB()) throw Error("Could not load database");
  if (config.seedDB) {
    await seedDB();
  }
  try {
    await setShowPaused();
  } catch (error) {
    console.log("show could not be set to paused");
    console.log(error);
  }
};
