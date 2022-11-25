import { ICompanyProperties } from "../types/types.objects";
import { DatabaseObject } from "./DatabaseObject";

/**
 * Company class
 */
export class Company extends DatabaseObject {
  name: string;
  description: string;
  initPricePerShare: number;
  currentPricePerShare: number;
  //finalPricePerShare: number
  tendency: 0 | 1 | -1;
  constructor(props: ICompanyProperties) {
    super(props.id);
    this.name = props.name;
    this.description = props.description;
    this.initPricePerShare = props.initPricePerShare;
    if (!props.currentPricePerShare)
      this.currentPricePerShare = props.initPricePerShare;
    else this.currentPricePerShare = props.currentPricePerShare;
    this.tendency = props.tendency;
  }
}
