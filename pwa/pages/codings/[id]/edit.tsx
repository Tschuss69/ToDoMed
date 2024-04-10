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

import { Form } from "../../../components/coding/Form";
import { PagedCollection } from "../../../types/collection";
import { Coding } from "../../../types/Coding";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getCoding = async (id: string | string[] | undefined) =>
  id ? await fetch<Coding>(`/codings/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: coding } = {} } = useQuery<
    FetchResponse<Coding> | undefined
  >(["coding", id], () => getCoding(id));

  if (!coding) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{coding && `Edit Coding ${coding["@id"]}`}</title>
        </Head>
      </div>
      <Form coding={coding} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["coding", id], () => getCoding(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Coding>>("/codings");
  const paths = await getItemPaths(response, "codings", "/codings/[id]/edit");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
