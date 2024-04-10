import { Item } from "./item";
import {Practitioner} from "./Practitioner";

export class HumanName implements Item {
  public "@id"?: string;

  constructor(
    public use: string,
    public family: string,
    _id?: string,
    public text?: string,
    public given?: string,
    public prefix?: string,
    public suffix?: string,
  ) {
    this["@id"] = _id;
  }
}
