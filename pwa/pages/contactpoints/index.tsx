import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getContactPoints,
  getContactPointsPath,
} from "../../components/contactpoint/PageList";

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getContactPointsPath(), getContactPoints());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export default PageList;
