import { IPlayerShareBundle } from "../types/types.objects";
import { DatabaseObject } from "./DatabaseObject";

/**
 * A share bundle is a bundle of shares - not necessarily sold all together.
 * These share bundles are all owned by the player.
 */
export class PlayerShareBundle extends DatabaseObject {
  companyId: number; //company for which these shares are
  companyName: string;
  quantity: number; //quantity of shares
  boughtAt: number;

  constructor(props: IPlayerShareBundle) {
    super(props.companyId);
    this.companyId = props.companyId;
    this.quantity = props.quantity;
    this.companyName = props.companyName;
    this.boughtAt = props.boughtAt;
  }
}
