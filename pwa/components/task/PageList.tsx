import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Task } from "../../types/Task";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getTasksPath = (page?: string | string[] | undefined) =>
  `/tasks${typeof page === "string" ? `?page=${page}` : ""}`;
export const getTasks = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Task>>(getTasksPath(page));
const getPagePath = (path: string) => `/tasks/page/${parsePage("tasks", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: tasks, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Task>> | undefined
  >(getTasksPath(page), getTasks(page));
  const collection = useMercure(tasks, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Task List</title>
        </Head>
      </div>
      <List tasks={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
