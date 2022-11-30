//database
import {
  insertElement,
  getListOfTableEntries,
  updateElement,
  deleteElementById,
} from "../mysql.wrapper";
//classes
import { ISellerProperties, IShareBundle } from "../../types/types.objects";
import { Seller } from "../../objects/Seller";
import { ShareBundle } from "../../objects/ShareBundle";
//config and fixtures
import { getCompaniesListFromDB } from "../companies/companies.manager";

/**
 * Get list of sellers and their share bundles
 * @returns {seller : Seller[], shareBundle : shareBundle[]} object with all sellers and all share bundles
 */
export const getSellersListFromDB = async () => {
  const sellersList = await getListOfTableEntries(Seller.name);
  const shareBundlesList = await getListOfTableEntries(ShareBundle.name);
  return { sellers: sellersList, shareBundles: shareBundlesList };
};

/**
 * Add new seller to database
 * @param seller
 */
export const addSellerToDB = async (seller: ISellerProperties) => {
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
 * edit seller's information (just name, no bundles)
 * @param newSeller
 * @returns
 */
export const editSellerInDB = async (newSeller: ISellerProperties) => {
  return await updateElement(new Seller(newSeller));
};

/**
 * delete seller and all bundles associated to them from the database
 * @param sellerId id of the seller to delete
 */
export const deleteSellerFromDB = async (sellerId: string) => {
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
