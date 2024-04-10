import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getPatients,
  getPatientsPath,
} from "../../../components/patient/PageList";
import { PagedCollection } from "../../../types/collection";
import { Patient } from "../../../types/Patient";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getPatientsPath(page), getPatients(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Patient>>("/patients");
  const paths = await getCollectionPaths(
    response,
    "patients",
    "/patients/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
