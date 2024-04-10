import { Item } from "./item";

export class CodeableConceptCategory implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public category?: string,
    public categoryHash?: string,
    public categorycodeableconcept?: string[],
    public parent?: string[],
    public codeableconcepts?: string[],
    public codeableConcepts?: string[],
    public categoryCodeableConcept?: string[]
  ) {
    this["@id"] = _id;
  }
}
