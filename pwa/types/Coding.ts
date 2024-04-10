import { Item } from "./item";

export class Coding implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public system?: string,
    public version?: string,
    public code?: string,
    public display?: string
  ) {
    this["@id"] = _id;
  }
}
