import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { CodeableConceptCategory } from "../../types/CodeableConceptCategory";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getCodeableConceptCategorysPath = (
  page?: string | string[] | undefined
) =>
  `/codeable_concept_categories${
    typeof page === "string" ? `?page=${page}` : ""
  }`;
export const getCodeableConceptCategorys =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<CodeableConceptCategory>>(
      getCodeableConceptCategorysPath(page)
    );
const getPagePath = (path: string) =>
  `/codeableconceptcategorys/page/${parsePage(
    "codeable_concept_categories",
    path
  )}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const {
    data: { data: codeableconceptcategorys, hubURL } = { hubURL: null },
  } = useQuery<
    FetchResponse<PagedCollection<CodeableConceptCategory>> | undefined
  >(getCodeableConceptCategorysPath(page), getCodeableConceptCategorys(page));
  const collection = useMercure(codeableconceptcategorys, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>CodeableConceptCategory List</title>
        </Head>
      </div>
      <List codeableconceptcategorys={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
