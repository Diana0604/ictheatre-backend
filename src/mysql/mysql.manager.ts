//database
import {
  insertElement,
  getAllTablesFromDB,
  getListOfTableEntries,
  getFirstTableElement,
  getElementById,
  updateElement,
  cleanDB,
  deleteElementById,
} from "./mysql.wrapper";
//classes
import { Company } from "../objects/Company";
import { PlayerCompany } from "../objects/PlayerCompany";
import { ShowStatus } from "../objects/ShowStatus";
import {
  ICompanyProperties,
  IPlayerCompanyProperties,
  IPlayerShareBundle,
  ISellerProperties,
  IShareBundle,
  IShowStatus,
} from "../types/types.objects";
import { Seller } from "../objects/Seller";
import { ShareBundle } from "../objects/ShareBundle";
//config and fixtures
import companies from "../fixtures/companies";
import playerCompanyFixture from "../fixtures/playerCompany";
import sellers from "../fixtures/sellers";
import shareBundlesFixture from "../fixtures/shareBundles";
import { PlayerShareBundle } from "../objects/PlayerShareBundle";
import { getCompaniesListFromDB } from "./companies/companies.manager";

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
  const showStatus = await getShowStatus();
  showStatus.timeSinceStartup = 0;
  //const showStatus = new ShowStatus({ timeSinceStartup: 0, isPlaying: false });
  await updateElement(showStatus);

  //setup player company
  const playerFixture = playerCompanyFixture;
  //@ts-ignore
  playerFixture.id = (await getPlayerCompanyInformation()).id;
  const playerCompany = new PlayerCompany(playerCompanyFixture);
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
    });
    await updateElement(newPlayerBundle);
  }

  //share bundles -> reset quantity to initial quantity
  const { shareBundles } = await getAllSellers();
  for (const shareBundle of shareBundles) {
    shareBundle.quantity = shareBundle.initialQuantity;
    updateElement(shareBundle);
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
export const getShowStatus = async () => {
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
    const showStatus = await getShowStatus();
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
    const showStatus = await getShowStatus();
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
    let showStatus = await getShowStatus();
    showStatus.timeSinceStartup = showStatus.timeSinceStartup + seconds;
    await updateElement(showStatus);
  } catch (error) {
    throw error;
  }
};


/**
 *
 * @returns list of all companies from database
 */
export const getAllSellers = async () => {
  const sellersList = await getListOfTableEntries(Seller.name);
  const shareBundlesList = await getListOfTableEntries(ShareBundle.name);
  let sellersObjectList: Seller[] = [];
  let shareBundlesObjectList: ShareBundle[] = [];
  //convert database objects into Seller / ShareBundle objects
  for (const element of sellersList) {
    const seller = new Seller(element as ISellerProperties);
    sellersObjectList.push(seller);
  }
  for (const element of shareBundlesList) {
    const bundle = new ShareBundle(element as IShareBundle);
    shareBundlesObjectList.push(bundle);
  }
  return { sellers: sellersObjectList, shareBundles: shareBundlesObjectList };
};

/**
 * edit seller's information (just name, no bundles)
 * @param newSeller
 * @returns
 */
export const editSellerInformation = async (newSeller: ISellerProperties) => {
  return await updateElement(new Seller(newSeller));
};

export const addSellerToDatabase = async (seller: ISellerProperties) => {
  const newSeller = new Seller(seller);
  await insertElement(newSeller);
  const allCompanies = await getCompaniesListFromDB();
  for (const company of allCompanies) {
    const emptyBundle = new ShareBundle({
      ownerId: newSeller.id,
      companyId: company.id,
      quantity: 0,
      companyName: company.name,
    });
    await insertElement(emptyBundle);
  }
};

/**
 * edit share bundles information
 * @param newShareBundle
 * @returns
 */
export const editShareBundleInformation = async (
  newShareBundle: IShareBundle
) => {
  const newObject = new ShareBundle(newShareBundle);
  return await updateElement(newObject);
};

/**
 * delete seller and all bundles associated to them from the database
 * @param sellerId id of the seller to delete
 */
export const deleteSellerFromDatabase = async (sellerId: string) => {
  await deleteElementById(sellerId, Seller.name);
  const companies = await getCompaniesListFromDB();
  for (const company of companies) {
    const shareBundleId = (sellerId as unknown as number) * company.id;
    await deleteElementById(
      shareBundleId as unknown as string,
      ShareBundle.name
    );
  }
};

export const sellShareBundle = async (
  bundleId: number,
  companyId: number,
  quantity: number,
  priceAtSale: number
) => {
  //get player company
  const databasePlayerCompany = await getFirstTableElement(PlayerCompany.name);
  const playerCompany = new PlayerCompany(
    databasePlayerCompany as IPlayerCompanyProperties
  );

  //get seller bundle
  const databaseSellerBundle = await getElementById(
    String(bundleId),
    ShareBundle.name
  );
  const sellerShareBundle = new ShareBundle(
    databaseSellerBundle as IShareBundle
  );

  //get company
  const databaseCompany = await getElementById(String(companyId), Company.name);
  const company = new Company(databaseCompany as ICompanyProperties);

  playerCompany.liquidAssets += quantity * priceAtSale * (25 / 100); //TODO - make percentage a variable
  playerCompany.stockValueScore += quantity * priceAtSale;
  //update ownership of bundles
  sellerShareBundle.quantity -= quantity;

  company.currentPricePerShare =
    company.currentPricePerShare * (1 + 0.0001) ** quantity;

  //update database with new objects
  await updateElement(playerCompany);
  await updateElement(sellerShareBundle);
  await updateElement(company);
};

export const sellPlayerShareBundle = async (
  companyId: number,
  quantity: number,
  priceAtSale: number
) => {
  //get player company
  const databasePlayerCompany = await getFirstTableElement(PlayerCompany.name);
  const playerCompany = new PlayerCompany(
    databasePlayerCompany as IPlayerCompanyProperties
  );
  //get player bundle
  const databaseSellerBundle = await getElementById(
    String(companyId),
    PlayerShareBundle.name
  );
  const shareBundle = new PlayerShareBundle(
    databaseSellerBundle as IPlayerShareBundle
  );
  //get company
  const databaseCompany = await getElementById(String(companyId), Company.name);
  const company = new Company(databaseCompany as ICompanyProperties);

  //update assets
  playerCompany.liquidAssets += quantity * priceAtSale;
  //update ownership of bundles
  shareBundle.quantity -= quantity;
  //company
  company.currentPricePerShare =
    company.currentPricePerShare * (1 + 0.0001) ** quantity;

  //save in database
  updateElement(playerCompany);
  updateElement(shareBundle);
  updateElement(company);
};

export const buyShareBundle = async (
  bundleId: number,
  companyId: number,
  quantity: number,
  priceAtSale: number
) => {
  //get player company
  const databasePlayerCompany = await getFirstTableElement(PlayerCompany.name);
  const playerCompany = new PlayerCompany(
    databasePlayerCompany as IPlayerCompanyProperties
  );

  //get seller bundle
  const databaseSellerBundle = await getElementById(
    String(bundleId),
    ShareBundle.name
  );
  const sellerShareBundle = new ShareBundle(
    databaseSellerBundle as IShareBundle
  );

  //get company
  const databaseCompany = await getElementById(String(companyId), Company.name);
  const company = new Company(databaseCompany as ICompanyProperties);

  playerCompany.liquidAssets -= quantity * priceAtSale * (25 / 100); //TODO - make percentage a variable
  playerCompany.stockValueScore -= quantity * priceAtSale;
  //update ownership of bundles
  sellerShareBundle.quantity += quantity;

  company.currentPricePerShare =
    company.currentPricePerShare * (1 - 0.0001) ** quantity;

  //update database with new objects
  await updateElement(playerCompany);
  await updateElement(sellerShareBundle);
  await updateElement(company);
};

export const buyPlayerShareBundle = async (
  companyId: number,
  quantity: number,
  priceAtSale: number
) => {
  //get player company
  const databasePlayerCompany = await getFirstTableElement(PlayerCompany.name);
  const playerCompany = new PlayerCompany(
    databasePlayerCompany as IPlayerCompanyProperties
  );

  //get seller bundle
  const databaseSellerBundle = await getElementById(
    String(companyId),
    PlayerShareBundle.name
  );
  const shareBundle = new PlayerShareBundle(
    databaseSellerBundle as IPlayerShareBundle
  );

  //get company
  const databaseCompany = await getElementById(String(companyId), Company.name);
  const company = new Company(databaseCompany as ICompanyProperties);

  playerCompany.liquidAssets -= quantity * priceAtSale;
  playerCompany.stockValueScore -= quantity * priceAtSale;
  //update ownership of bundles
  shareBundle.quantity += quantity;
  //update company shares price
  company.currentPricePerShare =
    company.currentPricePerShare * (1 - 0.0001) ** quantity;

  //update database with new objects
  await updateElement(playerCompany);
  await updateElement(shareBundle);
  await updateElement(company);
};

export const getAllPlayerBundles = async () => {
  const playerBundles = await getListOfTableEntries(PlayerShareBundle.name);
  let allBundlesList: PlayerShareBundle[] = [];
  //convert database objects into company objects
  for (const element of playerBundles) {
    const newBundle = new PlayerShareBundle(element as IPlayerShareBundle);
    allBundlesList.push(newBundle);
  }
  return allBundlesList;
}; 