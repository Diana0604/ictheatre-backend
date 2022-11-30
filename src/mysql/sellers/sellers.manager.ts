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
 *
 * @returns list of all companies from database
 */
export const getSellersListFromDB = async () => {
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
export const editSellerInDB = async (newSeller: ISellerProperties) => {
  return await updateElement(new Seller(newSeller));
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
