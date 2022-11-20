import { ISellerProperties } from "../types/types.objects";
import { DatabaseObject } from "./DatabaseObject";

/**
 * Player company class
 */
export class Seller extends DatabaseObject {
  name: string;

  constructor(props: ISellerProperties) {
    super(props.id);
    this.name = props.name;
  }
}
