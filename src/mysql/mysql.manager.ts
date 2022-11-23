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
  IPlayerShareBundleProps,
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
import shareBundles from "../fixtures/shareBundles";
import { PlayerShareBundle } from "../objects/PlayerShareBundle";

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
    const newCompany = new Company(company);
    await insertElement(newCompany);
    companiesArray.push(newCompany);
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
    // Create empty sharebundle for player
    const emptyPlayerBundle = new PlayerShareBundle({
      companyId: company.id,
      quantity: 0,
    });
    insertElement(emptyPlayerBundle);
    for (const seller of sellersArray) {
      // If bundle with those ids exists in fixtures -> insert that bundle
      let foundPair = false;
      for (const shareBundle of shareBundles) {
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
export const getAllCompanies = async () => {
  const companiesList = await getListOfTableEntries(Company.name);
  let allCompaniesList: Company[] = [];
  //convert database objects into company objects
  for (const element of companiesList) {
    const newCompany = new Company(element as ICompanyProperties);
    allCompaniesList.push(newCompany);
  }
  return allCompaniesList;
};

/**
 * Get information for just one company
 * @param companyId id of company you wish to retreive info for
 * @returns company object
 */
export const getCompanyInformation = async (companyId: string) => {
  return await getElementById(companyId, Company.name);
};

/**
 * Get information for player company
 * @returns player company object
 */
export const getPlayerCompanyInformation = async () => {
  return await getFirstTableElement(PlayerCompany.name);
};

/**
 * Update company info
 * @param newCompany
 * @returns
 */
export const editCompanyInformation = async (
  newCompany: ICompanyProperties
) => {
  return await updateElement(new Company(newCompany));
};

/**
 * Delete a company with given id from the database and all sharebundles associated with it
 * @param id
 * @returns
 */
export const deleteCompanyFromDatabase = async (id: string) => {
  await deleteElementById(id, Company.name);
  const allSellers = await getAllSellers();
  for (const seller of allSellers.sellers) {
    const shareBundleId = seller.id * (id as unknown as number);
    deleteElementById(shareBundleId as unknown as string, ShareBundle.name);
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

/**
 * edit share bundles information
 * @param newShareBundle
 * @returns
 */
export const editShareBundleInformation = async (
  newShareBundle: IShareBundle
) => {
  return await updateElement(new ShareBundle(newShareBundle));
};

/**
 * delete seller and all bundles associated to them from the database
 * @param sellerId id of the seller to delete
 */
export const deleteSellerFromDatabase = async (sellerId: string) => {
  await deleteElementById(sellerId, Seller.name);
  const companies = await getAllCompanies();
  for (const company of companies) {
    const shareBundleId = (sellerId as unknown as number) * company.id;
    await deleteElementById(
      shareBundleId as unknown as string,
      ShareBundle.name
    );
  }
};

export const editPlayerCompanyInformation = async (
  playerCompany: PlayerCompany
) => {
  return await updateElement(playerCompany);
};

export const transferSharesOwnershipToPlayer = async (
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
  //get player bundle
  const databasePlayerBundle = await getElementById(
    String(companyId),
    PlayerShareBundle.name
  );
  const playerBundle = new PlayerShareBundle(
    databasePlayerBundle as IPlayerShareBundleProps
  );
  //get seller bundle
  const databaseSellerBundle = await getElementById(
    String(bundleId),
    ShareBundle.name
  );
  const sellerShareBundle = new ShareBundle(
    databaseSellerBundle as IShareBundle
  );

  //update liquid assets
  playerCompany.liquidAssets -= quantity * priceAtSale;
  //update ownership of bundles
  playerBundle.quantity += quantity;
  sellerShareBundle.quantity -= quantity;

  //update database with new objects
  await updateElement(playerCompany);
  await updateElement(playerBundle);
  await updateElement(sellerShareBundle);
};
