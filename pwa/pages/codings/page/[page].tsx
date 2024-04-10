import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getCodings,
  getCodingsPath,
} from "../../../components/coding/PageList";
import { PagedCollection } from "../../../types/collection";
import { Coding } from "../../../types/Coding";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getCodingsPath(page), getCodings(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Coding>>("/codings");
  const paths = await getCollectionPaths(
    response,
    "codings",
    "/codings/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
