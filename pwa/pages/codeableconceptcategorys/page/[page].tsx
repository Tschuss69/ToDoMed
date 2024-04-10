import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getCodeableConceptCategorys,
  getCodeableConceptCategorysPath,
} from "../../../components/codeableconceptcategory/PageList";
import { PagedCollection } from "../../../types/collection";
import { CodeableConceptCategory } from "../../../types/CodeableConceptCategory";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    getCodeableConceptCategorysPath(page),
    getCodeableConceptCategorys(page)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<CodeableConceptCategory>>(
    "/codeable_concept_categories"
  );
  const paths = await getCollectionPaths(
    response,
    "codeable_concept_categories",
    "/codeableconceptcategorys/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
