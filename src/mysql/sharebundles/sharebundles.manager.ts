//database
import {
  getListOfTableEntries,
  getFirstTableElement,
  getElementById,
  updateElement,
} from "../mysql.wrapper";
//classes
import { Company } from "../../objects/Company";
import { PlayerCompany } from "../../objects/PlayerCompany";
import {
  ICompanyProperties,
  IPlayerCompanyProperties,
  IPlayerShareBundle,
  IShareBundle,
} from "../../types/types.objects";
import { ShareBundle } from "../../objects/ShareBundle";
//config and fixtures
import { PlayerShareBundle } from "../../objects/PlayerShareBundle";

/**
 * edit share bundles information
 * @param newShareBundle
 * @returns
 */
export const editShareBundleInDB = async (newShareBundle: IShareBundle) => {
  const newObject = new ShareBundle(newShareBundle);
  return await updateElement(newObject);
};

export const sellSharesInDB = async (
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

  if (company.name != "Rune")
    playerCompany.liquidAssets +=
      quantity * priceAtSale * (25 / 100); //TODO - make percentage a variable
  else playerCompany.liquidAssets -= quantity * priceAtSale;
  //update ownership of bundles
  sellerShareBundle.quantity -= quantity;

  company.currentPricePerShare =
    company.currentPricePerShare * (1 + 0.0001) ** quantity;

  //update database with new objects
  await updateElement(playerCompany);
  await updateElement(sellerShareBundle);
  await updateElement(company);
};

export const sellPlayerSharesInDB = async (
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

export const buySharesInDB = async (
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

  //update liquid assets depending on wether we are doing transaction with player company or not
  if (company.name != "Rune")
    playerCompany.liquidAssets -=
      quantity * priceAtSale * (25 / 100); //TODO - make percentage a variable
  else playerCompany.liquidAssets += quantity * priceAtSale;
  //update ownership of bundles
  sellerShareBundle.quantity += quantity;

  company.currentPricePerShare =
    company.currentPricePerShare * (1 - 0.0001) ** quantity;

  //update database with new objects
  await updateElement(playerCompany);
  await updateElement(sellerShareBundle);
  await updateElement(company);
};

export const buyPlayerSharesInDB = async (
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

export const getPlayerBundlesListFromDB = async () => {
  const playerBundles = await getListOfTableEntries(PlayerShareBundle.name);
  let allBundlesList: PlayerShareBundle[] = [];
  //convert database objects into company objects
  for (const element of playerBundles) {
    const newBundle = new PlayerShareBundle(element as IPlayerShareBundle);
    allBundlesList.push(newBundle);
  }
  return allBundlesList;
};
