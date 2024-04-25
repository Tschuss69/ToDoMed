import {fetch, parsePage} from "@/utils/dataAccess";
import {Task} from "@/types/Task";
import {PagedCollection} from "@/types/collection";

export const getTask = async (id: string | string[] | undefined) =>
  id ? await fetch<Task>(`/tasks/${id}`) : Promise.resolve(undefined);


export const getTasksPath = (page?: string | string[] | undefined) =>
  `/tasks${typeof page === "string" ? `?page=${page}` : ""}`;

export const getTasks = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Task>>(getTasksPath(page));

const getPagePath = (path: string) => `/tasks/page/${parsePage("tasks", path)}`;

export const saveTask = async (values) => {
    console.log(values)
    return await fetch<Task>(!values["@id"] ? "/tasks" : values["@id"], {
        method: !values["@id"] ? "POST" : "PUT",
        body: JSON.stringify(values),
    });
}

