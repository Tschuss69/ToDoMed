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

import { Form } from "../../../components/practitioner/Form";
import { PagedCollection } from "../../../types/collection";
import { Practitioner } from "../../../types/Practitioner";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getPractitioner = async (id: string | string[] | undefined) =>
  id
    ? await fetch<Practitioner>(`/practitioners/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: practitioner } = {} } = useQuery<
    FetchResponse<Practitioner> | undefined
  >(["practitioner", id], () => getPractitioner(id));

  if (!practitioner) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>
            {practitioner && `Edit Practitioner ${practitioner["@id"]}`}
          </title>
        </Head>
      </div>
      <Form practitioner={practitioner} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["practitioner", id], () =>
    getPractitioner(id)
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
  const paths = await getItemPaths(
    response,
    "practitioners",
    "/practitioners/[id]/edit"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
