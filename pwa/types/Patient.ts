import { Item } from "./item";
import {HumanName} from "@/types/HumanName";
import {Encounter} from "@/types/Encounter";

export class Patient implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public name?: HumanName[],
    public generalPractitioner?: string[],
    public email?: string,
    public phone?: string,
    public gender?: string,
    public birthDate?: Date,
    public telecom?: any,
    public encounters?: Array<Encounter>
  ) {
    this["@id"] = _id;
  }
}
