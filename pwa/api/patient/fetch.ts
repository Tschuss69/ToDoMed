import {fetch} from "@/utils/dataAccess";
import {Patient} from "@/types/Patient";
import {Encounter} from "@/types/Encounter";

interface Props {
  patient?: Patient;
}

interface SaveParams {
  values: Patient;
}

interface DeleteParams {
  id: string;
}

export const savePatient = async ({ values }: SaveParams) =>
  await fetch<Patient>(!values["@id"] ? "/patients" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

export const deletePatient = async (id: string) =>
  await fetch<Patient>(id, { method: "DELETE" });


export const getPatient = async (id: string | string[] | undefined) =>
  id ? await fetch<Patient>(`/patients/${id}`) : Promise.resolve(undefined);

export const getEncountersByPatient =
  (id : number) => async () =>
    await fetch<Encounter>(`/patients/${id}/encounters`);
