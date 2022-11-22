import { IPlayerShareBundleProps } from "../types/types.objects";
import { DatabaseObject } from "./DatabaseObject";

/**
 * A share bundle is a bundle of shares - not necessarily sold all together.
 * It has th info on which company are they from.
 * All PlayerShareBundles are owned by the player company.
 */
export class PlayerShareBundle extends DatabaseObject {
  companyId: number; //company for which these shares are
  quantity: number; //quantity of shares

  constructor(props: IPlayerShareBundleProps) {
    const id = props.companyId;
    super(id);
    this.companyId = props.companyId;
    this.quantity = props.quantity;
  }
}
