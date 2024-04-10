import {fetch, parsePage} from "@/utils/dataAccess";
import {Encounter} from "@/types/Encounter";
import {PagedCollection} from "@/types/collection";

interface Props {
  patient?: Encounter;
}

interface SaveParams {
  values: Encounter;
}

interface DeleteParams {
  id: string;
}

export const saveEncounter = async ({ values }: SaveParams) =>
  await fetch<Encounter>(!values["@id"] ? "/encounters" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

export const deleteEncounter = async (id: string) =>
  await fetch<Encounter>(id, { method: "DELETE" });


export const getEncountersPath = (page?: string | string[] | undefined) =>
  `/encounters${typeof page === "string" ? `?page=${page}` : ""}`;

export const getEncounters =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<Encounter>>(getEncountersPath(page));


const getPagePath = (path: string) =>
  `/encounters/page/${parsePage("encounters", path)}`;
