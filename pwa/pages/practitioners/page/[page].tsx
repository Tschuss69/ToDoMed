import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getPractitioners,
  getPractitionersPath,
} from "../../../components/practitioner/PageList";
import { PagedCollection } from "../../../types/collection";
import { Practitioner } from "../../../types/Practitioner";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    getPractitionersPath(page),
    getPractitioners(page)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Practitioner>>("/practitioners");
  const paths = await getCollectionPaths(
    response,
    "practitioners",
    "/practitioners/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
