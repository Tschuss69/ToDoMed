import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Coding } from "../../types/Coding";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getCodingsPath = (page?: string | string[] | undefined) =>
  `/codings${typeof page === "string" ? `?page=${page}` : ""}`;
export const getCodings = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Coding>>(getCodingsPath(page));
const getPagePath = (path: string) =>
  `/codings/page/${parsePage("codings", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: codings, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Coding>> | undefined
  >(getCodingsPath(page), getCodings(page));
  const collection = useMercure(codings, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Coding List</title>
        </Head>
      </div>
      <List codings={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
