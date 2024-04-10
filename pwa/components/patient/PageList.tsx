import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Patient } from "../../types/Patient";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getPatientsPath = (page?: string | string[] | undefined) =>
  `/patients${typeof page === "string" ? `?page=${page}` : ""}`;
export const getPatients = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Patient>>(getPatientsPath(page));
const getPagePath = (path: string) =>
  `/patients/page/${parsePage("patients", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: patients, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Patient>> | undefined
  >(getPatientsPath(page), getPatients(page));
  const collection = useMercure(patients, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Patient List</title>
        </Head>
      </div>
      <List patients={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
