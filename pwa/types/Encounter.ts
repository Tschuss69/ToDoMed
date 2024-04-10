import { Item } from "./item";
import {Patient} from "@/types/Patient";
import {CodeableConcept} from "@/types/CodeableConcept";
import {Task} from "@/types/Task";

export class Encounter implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public status?: 'planned' | 'in-progress' | 'on-hold' | 'discharged' | 'completed' | 'cancelled' | 'discontinued' | 'entered-in-error' | 'unknown',
    public subject?: Patient,
    public plannedStartDate?: Date,
    public type?: CodeableConcept,
    public actor?: string[],
    public tasks?: Array<Task>
  ) {
    this["@id"] = _id;
  }
}
