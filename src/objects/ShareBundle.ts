import { IShareBundle } from "../types/types.objects";
import { DatabaseObject } from "./DatabaseObject";

/**
 * A share bundle is a bundle of shares - not necessarily sold all together.
 * It has th info on who owns these shares and which company are they from.
 */
export class ShareBundle extends DatabaseObject {
  ownerId: number; //who owns shares -> our company or a potential seller
  companyId: number; //company for which these shares are
  companyName: string;
  quantity: number; //quantity of shares
  initialQuantity: number;

  constructor(props: IShareBundle) {
    //bijective method between NxN->N to create ids
    //WHERE (i,j) -> n // m = i + j, n=m(m+1)/2+j // n=(i+j)(i+j+1)/2+j
    const i = props.ownerId;
    const j = props.companyId;
    const id = ((i + j) * (i + j + 1)) / 2 + j;
    super(id);
    this.ownerId = props.ownerId;
    this.companyId = props.companyId;
    this.quantity = props.quantity;
    this.companyName = props.companyName;
    if (!props.initialQuantity) this.initialQuantity = props.quantity;
    else this.initialQuantity = props.initialQuantity;
  }
}
