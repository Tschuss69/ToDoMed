import { Item } from "./item";

export class ContactPoint implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public system?: string,
    public value?: string,
    public use?: string,
    public rank?: number
  ) {
    this["@id"] = _id;
  }
}
