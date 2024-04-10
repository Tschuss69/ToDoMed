import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { ContactPoint } from "../../types/ContactPoint";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getContactPointsPath = (page?: string | string[] | undefined) =>
  `/contact_points${typeof page === "string" ? `?page=${page}` : ""}`;
export const getContactPoints =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<ContactPoint>>(getContactPointsPath(page));
const getPagePath = (path: string) =>
  `/contactpoints/page/${parsePage("contact_points", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: contactpoints, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<ContactPoint>> | undefined
  >(getContactPointsPath(page), getContactPoints(page));
  const collection = useMercure(contactpoints, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>ContactPoint List</title>
        </Head>
      </div>
      <List contactpoints={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
