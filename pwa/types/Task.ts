import { Item } from "./item";
import {PractitionerRole} from "./PractitionerRole";

export class Task implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public title?: string,
    public status?: 'requested' | 'in-progress' | 'completed' | 'cancelled',
    public priority?: 'routine' |'urgent',
    public description?: string,
    public authoredOn?: Date,
    public lastModified?: Date,
    public requesterPractitionerRole?: PractitionerRole,
    public requestedPerformers?: Array<PractitionerRole>,
    public completionRate?: number,
    public content?: 'initial' | 'intervention' | 'complication' | 'telesuivi',
  ) {
    this["@id"] = _id;
  }
}
