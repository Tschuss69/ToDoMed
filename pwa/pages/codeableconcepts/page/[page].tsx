import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getCodeableConcepts,
  getCodeableConceptsPath,
} from "../../../components/codeableconcept/PageList";
import { PagedCollection } from "../../../types/collection";
import { CodeableConcept } from "../../../types/CodeableConcept";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    getCodeableConceptsPath(page),
    getCodeableConcepts(page)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<CodeableConcept>>(
    "/codeable_concepts"
  );
  const paths = await getCollectionPaths(
    response,
    "codeable_concepts",
    "/codeableconcepts/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
