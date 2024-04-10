import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getEncounters,
  getEncountersPath,
} from "../../../components/encounter/PageList";
import { PagedCollection } from "../../../types/collection";
import { Encounter } from "../../../types/Encounter";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getEncountersPath(page), getEncounters(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Encounter>>("/encounters");
  const paths = await getCollectionPaths(
    response,
    "encounters",
    "/encounters/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
