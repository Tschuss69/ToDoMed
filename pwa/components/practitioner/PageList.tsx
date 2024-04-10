import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Practitioner } from "../../types/Practitioner";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getPractitionersPath = (page?: string | string[] | undefined) =>
  `/practitioners${typeof page === "string" ? `?page=${page}` : ""}`;
export const getPractitioners =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<Practitioner>>(getPractitionersPath(page));
const getPagePath = (path: string) =>
  `/practitioners/page/${parsePage("practitioners", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: practitioners, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Practitioner>> | undefined
  >(getPractitionersPath(page), getPractitioners(page));
  const collection = useMercure(practitioners, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Practitioner List</title>
        </Head>
      </div>
      <List practitioners={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
