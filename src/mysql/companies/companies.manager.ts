//database
import {
  insertElement,
  getListOfTableEntries,
  getFirstTableElement,
  getElementById,
  updateElement,
  deleteElementById,
} from "../mysql.wrapper";
//classes
import { Company } from "../../objects/Company";
import { PlayerCompany } from "../../objects/PlayerCompany";
import {
  ICompanyProperties,
  IPlayerCompanyProperties,
} from "../../types/types.objects";
import { ShareBundle } from "../../objects/ShareBundle";
import { getSellersListFromDB } from "../sellers/sellers.manager";

/**
 *
 * @returns list of all companies from database
 */
export const getCompaniesListFromDB = async () => {
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
export const getCompanyFromDB = async (companyId: string) => {
  return await getElementById(companyId, Company.name);
};

/**
 * Get information for player company
 * @returns player company object
 */
export const getPlayerCompanyFromDB = async () => {
  return await getFirstTableElement(PlayerCompany.name);
};

/**
 * Create a new company and save it in database
 * @param company
 */
export const addCompanyToDB = async (company: ICompanyProperties) => {
  await insertElement(new Company(company));
};

/**
 * Update company info
 * @param newCompany
 * @returns
 */
export const editCompanyInDB = async (newCompany: ICompanyProperties) => {
  return await updateElement(new Company(newCompany));
};

/**
 * Edit player company in database with new properties
 * @param playerCompany
 * @returns
 */
export const editPlayerCompanyInDB = async (
  playerCompany: IPlayerCompanyProperties
) => {
  const newCompany = new PlayerCompany(playerCompany);
  return await updateElement(newCompany);
};

/**
 * Delete a company with given id from the database and all sharebundles associated with it
 * @param id
 * @returns
 */
export const deleteCompanyFromDB = async (id: string) => {
  deleteElementById(id, Company.name);
  const allSellers = await getSellersListFromDB();
  for (const seller of allSellers.sellers) {
    const shareBundleId = seller.id * (id as unknown as number);
    deleteElementById(shareBundleId as unknown as string, ShareBundle.name);
  }
};
