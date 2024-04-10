import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { CodeableConcept } from "../../types/CodeableConcept";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getCodeableConceptsPath = (page?: string | string[] | undefined) =>
  `/codeable_concepts${typeof page === "string" ? `?page=${page}` : ""}`;
export const getCodeableConcepts =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<CodeableConcept>>(
      getCodeableConceptsPath(page)
    );
const getPagePath = (path: string) =>
  `/codeableconcepts/page/${parsePage("codeable_concepts", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: codeableconcepts, hubURL } = { hubURL: null } } =
    useQuery<FetchResponse<PagedCollection<CodeableConcept>> | undefined>(
      getCodeableConceptsPath(page),
      getCodeableConcepts(page)
    );
  const collection = useMercure(codeableconcepts, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>CodeableConcept List</title>
        </Head>
      </div>
      <List codeableconcepts={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
