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

import { Form } from "../../../components/humanname/Form";
import { PagedCollection } from "../../../types/collection";
import { HumanName } from "../../../types/HumanName";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getHumanName = async (id: string | string[] | undefined) =>
  id
    ? await fetch<HumanName>(`/human_names/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: humanname } = {} } = useQuery<
    FetchResponse<HumanName> | undefined
  >(["humanname", id], () => getHumanName(id));

  if (!humanname) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{humanname && `Edit HumanName ${humanname["@id"]}`}</title>
        </Head>
      </div>
      <Form humanname={humanname} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["humanname", id], () => getHumanName(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<HumanName>>("/human_names");
  const paths = await getItemPaths(
    response,
    "human_names",
    "/humannames/[id]/edit"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
