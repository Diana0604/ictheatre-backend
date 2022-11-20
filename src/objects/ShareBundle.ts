import { IShareBundle } from "../types/types.objects";
import { DatabaseObject } from "./DatabaseObject";

/**
 * A share bundle is a bundle of shares - not necessarily sold all together.
 * It has th info on who owns these shares and which company are they from.
 */
export class ShareBundle extends DatabaseObject {
  ownerId: number; //who owns shares -> our company or a potential seller
  companyId: number; //company for which these shares are
  quantity: number; //quantity of shares

  constructor(props: IShareBundle) {
    super(props.id);
    this.ownerId = props.ownerId;
    this.companyId = props.companyId;
    this.quantity = props.quantity;
  }
}
