import { Item } from "./item";
import {Task} from "./Task";
import {Practitioner} from "./Practitioner";

export class PractitionerRole implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public practitioner?: Practitioner,
    public codeCode?: 'médecin'| 'secrétaire' | 'infirmière' | 'ARC',
    public requestedTasks?: Array<Task>,
    public performingTasks?: Array<Task>
  ) {
    this["@id"] = _id;
  }
}
