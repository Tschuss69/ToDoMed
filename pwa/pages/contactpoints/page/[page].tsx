import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getContactPoints,
  getContactPointsPath,
} from "../../../components/contactpoint/PageList";
import { PagedCollection } from "../../../types/collection";
import { ContactPoint } from "../../../types/ContactPoint";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    getContactPointsPath(page),
    getContactPoints(page)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<ContactPoint>>(
    "/contact_points"
  );
  const paths = await getCollectionPaths(
    response,
    "contact_points",
    "/contactpoints/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
