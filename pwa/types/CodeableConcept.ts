import { Item } from "./item";

export class CodeableConcept implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public coding?: string[],
    public text?: string
  ) {
    this["@id"] = _id;
  }
}
