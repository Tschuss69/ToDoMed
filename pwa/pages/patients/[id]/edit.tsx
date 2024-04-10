import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Form } from "../../../components/patient/Form";
import { PagedCollection } from "../../../types/collection";
import { Patient } from "../../../types/Patient";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getPatient = async (id: string | string[] | undefined) =>
  id ? await fetch<Patient>(`/patients/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: patient } = {} } = useQuery<
    FetchResponse<Patient> | undefined
  >(["patient", id], () => getPatient(id));

  if (!patient) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{patient && `Edit Patient ${patient["@id"]}`}</title>
        </Head>
      </div>
      <Form patient={patient} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["patient", id], () => getPatient(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Patient>>("/patients");
  const paths = await getItemPaths(response, "patients", "/patients/[id]/edit");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
