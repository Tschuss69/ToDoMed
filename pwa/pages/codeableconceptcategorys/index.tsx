import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getCodeableConceptCategorys,
  getCodeableConceptCategorysPath,
} from "../../components/codeableconceptcategory/PageList";

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    getCodeableConceptCategorysPath(),
    getCodeableConceptCategorys()
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export default PageList;
