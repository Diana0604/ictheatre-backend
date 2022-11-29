/**
 * Properties to be passed in company constructor
 */
export interface ICompanyProperties {
  id?: number;
  name: string;
  description: string;
  initPricePerShare: number; //price at init of show
  //finalPricePerShare: number; //price at end of show
  currentPricePerShare?: number; //price right now
  tendency: 0 | 1 | -1;
}

/**
 * Properties to be passed in the player company constructor
 */
export interface IPlayerCompanyProperties {
  id?: number;
  name: string;
  stockValueScore: number; //stock value score at init of show
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
  ownerId: number;
  companyId: number;
  quantity: number;
  companyName: string;
};
