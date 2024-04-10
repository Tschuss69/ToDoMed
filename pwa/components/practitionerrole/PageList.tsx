import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { PractitionerRole } from "../../types/PractitionerRole";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getPractitionerRolesPath = (
  page?: string | string[] | undefined
) => `/practitioner_roles${typeof page === "string" ? `?page=${page}` : ""}`;
export const getPractitionerRoles =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<PractitionerRole>>(
      getPractitionerRolesPath(page)
    );
const getPagePath = (path: string) =>
  `/practitionerroles/page/${parsePage("practitioner_roles", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: practitionerroles, hubURL } = { hubURL: null } } =
    useQuery<FetchResponse<PagedCollection<PractitionerRole>> | undefined>(
      getPractitionerRolesPath(page),
      getPractitionerRoles(page)
    );
  const collection = useMercure(practitionerroles, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>PractitionerRole List</title>
        </Head>
      </div>
      <List practitionerroles={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
