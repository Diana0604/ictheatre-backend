import config from "../config/config.index";
import {
  addToTimerInSeconds,
  getShowStatus,
} from "../mysql/mysql.manager";
import { getCompaniesListFromDB } from "../mysql/companies/companies.manager";
import { updateElement } from "../mysql/mysql.wrapper";
import { Company } from "../objects/Company";

/**
 * set an interval to update:
 * 1. Timer
 * 2. Companies according to new time
 */
export const startUpdates = async () => {
  try {
    //get companies list from database
    const allCompaniesList = await getCompaniesListFromDB();
    //set the interval for every second and store it in global variable
    return setInterval(async () => {
      await updateTimer();
      for (const company of allCompaniesList) {
        updatePrice(company);
      }
    }, config.showConfig.updateIntervalInSeconds * 1000);
  } catch (error) {
    throw error;
  }
};

/**
 * Update timer in database
 */
const updateTimer = async () => {
  await addToTimerInSeconds(config.showConfig.updateIntervalInSeconds);
};

/**
 *  Update the company price following a linear aproximation from initial price to final price
 * @param company
 */
const updatePrice = async (company: Company) => {
  company.currentPricePerShare;
  //const secsSinceStartup = (await getShowStatus()).timeSinceStartup
  //const linearPrice = (company.finalPricePerShare - company.initPricePerShare) / config.showConfig.lengthInSeconds * secsSinceStartup + company.initPricePerShare
  //company.currentPricePerShare = linearPrice
  //price gets updated with a random between [-1,1] (math.random() gives [0,1] and then transform it)
  company.currentPricePerShare +=
    Math.random() * 2 - 1 + Math.random() * company.tendency;
  if (company.currentPricePerShare < 0) {
    company.currentPricePerShare = 1;
    company.tendency = 1;
  }
  if (company.currentPricePerShare > 3000) {
    company.tendency = -1;
  }
  await updateElement(company);
};
