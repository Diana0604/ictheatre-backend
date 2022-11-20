/**
 * Properties to be passed in company constructor
 */
export interface ICompanyProperties {
  id?: number;
  name: string;
  description: string;
  initPricePerShare: number; //price at init of show
  finalPricePerShare: number; //price at end of show
  currentPricePerShare?: number; //price right now
}

/**
 * Properties to be passed in the player company constructor
 */
export interface IPlayerCompanyProperties {
  id?: number;
  name: string;
  pricePerShare: number; //price at init of show
  publicRelationsIndex: number; //Public Relations index
  liquidAssets: number; //how much money does the company have
}

/**
 * Properties to be passed in the seller constructor
 */
export interface ISellerProperties {
  id?: number;
  name: string;
}

/**
 * Timer of show development
 */
export interface IShowStatus {
  id?: number;
  timeSinceStartup: number;
  isPlaying: boolean;
}

export interface ISeller {
  id?: number;
}

/**
 * one single item of company shares
 */
export type IShareBundle = {
  id?: number;
  ownerId: number;
  companyId: number;
  quantity: number;
};
