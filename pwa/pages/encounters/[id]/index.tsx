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

import { Show } from "@/components/encounter/Show";
import { PagedCollection } from "@/types/collection";
import { Encounter } from "@/types/Encounter";
import { fetch, FetchResponse, getItemPaths } from "@/utils/dataAccess";
import { useMercure } from "@/utils/mercure";

const getEncounter = async (id: string | string[] | undefined) =>
  id ? await fetch<Encounter>(`/encounters/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: { data: encounter, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery<FetchResponse<Encounter> | undefined>(["encounter", id], () =>
    getEncounter(id)
  );
  const encounterData = useMercure(encounter, hubURL);

  if (!encounterData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Encounter ${encounterData["@id"]}`}</title>
        </Head>
      </div>
      <Show encounter={encounterData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["encounter", id], () => getEncounter(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Encounter>>("/encounters");
  const paths = await getItemPaths(response, "encounters", "/encounters/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
