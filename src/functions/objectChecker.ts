//UNFORTUANTELY -> there is no way to do this non manually
//check in types.object.d.ts to see what properties each type needs and update :/

/**
 * Check if given object has all properties needed for a company
 * @param potentialCompany
 * @returns
 */
export const isCompany = (potentialCompany: any) => {
  if (!potentialCompany.name) return false;
  if (!potentialCompany.description) return false;
  if (!potentialCompany.initPricePerShare) return false;
  if (!potentialCompany.tendency) return false;
  return true;
};

/**
 * check if potential company has properties needed for a company + optional properties
 * @param potentialCompany
 * @returns
 */
export const isExistingCompany = (potentialCompany: any) => {
  if (!isCompany(potentialCompany)) return false;
  if (!potentialCompany.id) return false;
  if (!potentialCompany.currentPricePerShare) return false;
};

/**
 * Check if given object has all properties needed for player a company
 * @param potentialCompany
 * @returns
 */
 export const isPlayerCompany = (potentialCompany: any) => {
  if (!potentialCompany.name) return false;
  if (!potentialCompany.stockValueScore) return false;
  if (!potentialCompany.publicRelationsIndex) return false;
  if (!potentialCompany.liquidAssets) return false;
  return true;
};

/**
 * Check if given object has all properties needed for player a company
 * @param potentialCompany
 * @returns
 */
 export const isExistingPlayerCompany = (potentialCompany: any) => {
  if (!isPlayerCompany(potentialCompany)) return false;
  if(!potentialCompany.id) return false;
  return true;
};