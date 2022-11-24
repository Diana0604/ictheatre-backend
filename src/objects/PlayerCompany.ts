import { IPlayerCompanyProperties } from "../types/types.objects";
import { DatabaseObject } from "./DatabaseObject";

/**
 * Player company class
 */
export class PlayerCompany extends DatabaseObject {
  name: string;
  stockValueScore: number;
  publicRelationsIndex: number;
  liquidAssets: number;

  constructor(props: IPlayerCompanyProperties) {
    super(props.id);
    this.name = props.name;
    this.stockValueScore = props.stockValueScore;
    this.publicRelationsIndex = props.publicRelationsIndex;
    this.liquidAssets = props.liquidAssets;
  }
}
