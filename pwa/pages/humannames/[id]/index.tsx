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

import { Show } from "../../../components/humanname/Show";
import { PagedCollection } from "../../../types/collection";
import { HumanName } from "../../../types/HumanName";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getHumanName = async (id: string | string[] | undefined) =>
  id
    ? await fetch<HumanName>(`/human_names/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: { data: humanname, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery<FetchResponse<HumanName> | undefined>(["humanname", id], () =>
    getHumanName(id)
  );
  const humannameData = useMercure(humanname, hubURL);

  if (!humannameData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show HumanName ${humannameData["@id"]}`}</title>
        </Head>
      </div>
      <Show humanname={humannameData} text={text} />
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
  const paths = await getItemPaths(response, "human_names", "/humannames/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
