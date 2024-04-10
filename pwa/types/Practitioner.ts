import { Item } from "./item";
import {HumanName} from "./HumanName";
import {PractitionerRole} from "./PractitionerRole";

export class Practitioner implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public names?: Array<HumanName>,
    public gender?: 'male' | 'female' | 'other' | 'unknown',
    public birthDate?: Date,
    public practitionerRoles?: Array<PractitionerRole>
  ) {
    this["@id"] = _id;
  }
}
