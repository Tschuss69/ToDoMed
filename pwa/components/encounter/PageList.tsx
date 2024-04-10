import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Encounter } from "../../types/Encounter";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getEncountersPath = (page?: string | string[] | undefined) =>
  `/encounters${typeof page === "string" ? `?page=${page}` : ""}`;
export const getEncounters =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<Encounter>>(getEncountersPath(page));
const getPagePath = (path: string) =>
  `/encounters/page/${parsePage("encounters", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: encounters, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Encounter>> | undefined
  >(getEncountersPath(page), getEncounters(page));
  const collection = useMercure(encounters, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Encounter List</title>
        </Head>
      </div>
      <List encounters={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
