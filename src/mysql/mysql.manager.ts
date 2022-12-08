//database
import {
  insertElement,
  getAllTablesFromDB,
  getListOfTableEntries,
  getFirstTableElement,
  updateElement,
  cleanDB,
} from "./mysql.wrapper";
//classes
import { Company } from "../objects/Company";
import { PlayerCompany } from "../objects/PlayerCompany";
import { ShowStatus } from "../objects/ShowStatus";
import { IShowStatus } from "../types/types.objects";
import { Seller } from "../objects/Seller";
import { ShareBundle } from "../objects/ShareBundle";
//config and fixtures
import companies from "../fixtures/companies";
import playerCompanyFixture from "../fixtures/playerCompany";
import sellers from "../fixtures/sellers";
import shareBundlesFixture from "../fixtures/shareBundles";
import { PlayerShareBundle } from "../objects/PlayerShareBundle";
import {
  getCompaniesListFromDB,
  getPlayerCompanyFromDB,
} from "./companies/companies.manager";
import { getSellersListFromDB } from "./sellers/sellers.manager";

/**
 * seed database with:
 * 1. ShowStatus -> create a new show status manager object and add it to database
 * 2. Companies -> the bot companies that represent other companeis
 * show tables at end
 */
export const seedDB = async () => {
  await cleanDB();
  //setup show status
  const showStatus = new ShowStatus({ timeSinceStartup: 0, isPlaying: false });
  await insertElement(showStatus);

  //setup player company
  const playerCompany = new PlayerCompany(playerCompanyFixture);
  await insertElement(playerCompany);
  const companiesArray = [];
  //loop through fixtures and add to database
  for (const company of companies) {
    //@ts-ignore
    const newCompany = new Company(company);
    await insertElement(newCompany);
    companiesArray.push(newCompany);
    //add empty player share bundle
    const newPlayerBundle = new PlayerShareBundle({
      companyId: newCompany.id,
      companyName: newCompany.name,
      quantity: 0,
      boughtAt: 0
    });
    await insertElement(newPlayerBundle);
  }

  const sellersArray = [];
  //loop through sellers and add to database
  for (const seller of sellers) {
    const newSeller = new Seller(seller);
    await insertElement(newSeller);
    sellersArray.push(newSeller);
  }

  //share bundles:
  // Loop through companies and sellers
  for (const company of companiesArray) {
    for (const seller of sellersArray) {
      // If bundle with those ids exists in fixtures -> insert that bundle
      let foundPair = false;
      for (const shareBundle of shareBundlesFixture) {
        if (
          shareBundle.ownerId === seller.id &&
          shareBundle.companyId === company.id
        ) {
          const newShareBundle = new ShareBundle(shareBundle);
          await insertElement(newShareBundle);
          foundPair = true;
        }
      }
      if (foundPair) continue;
      // Else -> insert empty bundle
      const emptyBundle = new ShareBundle({
        ownerId: seller.id,
        companyId: company.id,
        quantity: 0,
        companyName: company.name,
        boughtAt: 0
      });
      await insertElement(emptyBundle);
    }
  }

  console.log("database seeded");

  //display all tables that have been created
  try {
    showAllTables();
  } catch (error) {
    console.log("problem showing tables at end");
    console.log(error);
  }
};

export const resetDB = async () => {
  //await cleanDB();
  //setup show status
  const showStatus = await getShowStatusFromDB();
  showStatus.timeSinceStartup = 0;
  console.log("update show status");
  await updateElement(showStatus);

  //setup player company
  const playerFixture = playerCompanyFixture;
  //@ts-ignore
  playerFixture.id = (await getPlayerCompanyFromDB()).id;
  const playerCompany = new PlayerCompany(playerCompanyFixture);
  console.log("update playercomp");
  await updateElement(playerCompany);

  const companiesArray = await getCompaniesListFromDB();
  //loop through fixtures and add to database
  for (const company of companiesArray) {
    //@ts-ignore
    const newCompany = new Company(company);
    newCompany.currentPricePerShare = company.initPricePerShare;
    await updateElement(newCompany);
    //reset player bundles
    const newPlayerBundle = new PlayerShareBundle({
      companyId: newCompany.id,
      companyName: newCompany.name,
      quantity: 0,
      boughtAt: 0
    });
    await updateElement(newPlayerBundle);
  }

  //share bundles -> reset quantity to initial quantity
  //const shareBun
  const { shareBundles } = await getSellersListFromDB();
  for (const shareBundle of shareBundles) {
    const newShareBundle = new ShareBundle(shareBundle)
    newShareBundle.quantity = shareBundle.initialQuantity;
    updateElement(newShareBundle);
  }

  console.log("database reset");

  //display all tables that have been created
  try {
    showAllTables();
  } catch (error) {
    console.log("problem showing tables at end");
    console.log(error);
  }
};

/**
 * Get show status from database
 * @returns show status as object
 */
export const getShowStatusFromDB = async () => {
  try {
    const showStatus = await getFirstTableElement(ShowStatus.name);
    if (!showStatus) {
      return new ShowStatus({ timeSinceStartup: 0, isPlaying: false });
    }
    return new ShowStatus(showStatus as IShowStatus);
  } catch (error) {
    console.log("error getting show status");
    throw error;
  }
};

/**
 * Display name of all the tables that are set in our database
 * TODO: will eventually display all content of all tables
 */
const showAllTables = async () => {
  try {
    const tables = await getAllTablesFromDB();
    for (const table of tables) {
      console.log(`======================= TABLE ==========================`);
      console.log(`TableTitle: ${table.Tables_in_ictheatre}`);
      const listOfEntries = await getListOfTableEntries(
        table.Tables_in_ictheatre
      );
      for (const entry of listOfEntries) {
        console.log(`=== ENTRY: `);
        for (const key in entry) {
          console.log(`${key}: ${entry[key]}`);
        }
      }
    }
  } catch (error) {
    throw error;
  }
};

/**
 * get show object from db and set to started
 */
export const setShowStarted = async () => {
  try {
    const showStatus = await getShowStatusFromDB();
    showStatus.isPlaying = true;
    await updateElement(showStatus);
  } catch (error) {
    throw error;
  }
};

/**
 * get show object from db and set to started
 */
export const setShowPaused = async () => {
  try {
    const showStatus = await getShowStatusFromDB();
    showStatus.isPlaying = false;
    await updateElement(showStatus);
  } catch (error) {
    throw error;
  }
};

/**
 * Update timer in show status to +1
 */
export const addToTimerInSeconds = async (seconds: number) => {
  try {
    let showStatus = await getShowStatusFromDB();
    showStatus.timeSinceStartup = showStatus.timeSinceStartup + seconds;
    await updateElement(showStatus);
  } catch (error) {
    throw error;
  }
};
