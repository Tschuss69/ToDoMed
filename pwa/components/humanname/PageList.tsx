import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { HumanName } from "../../types/HumanName";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getHumanNamesPath = (page?: string | string[] | undefined) =>
  `/human_names${typeof page === "string" ? `?page=${page}` : ""}`;
export const getHumanNames =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<HumanName>>(getHumanNamesPath(page));
const getPagePath = (path: string) =>
  `/humannames/page/${parsePage("human_names", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: humannames, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<HumanName>> | undefined
  >(getHumanNamesPath(page), getHumanNames(page));
  const collection = useMercure(humannames, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>HumanName List</title>
        </Head>
      </div>
      <List humannames={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
