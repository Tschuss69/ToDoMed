import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getHumanNames,
  getHumanNamesPath,
} from "../../../components/humanname/PageList";
import { PagedCollection } from "../../../types/collection";
import { HumanName } from "../../../types/HumanName";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getHumanNamesPath(page), getHumanNames(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<HumanName>>("/human_names");
  const paths = await getCollectionPaths(
    response,
    "human_names",
    "/humannames/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
