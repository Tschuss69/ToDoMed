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

import { Show } from "../../../components/codeableconcept/Show";
import { PagedCollection } from "../../../types/collection";
import { CodeableConcept } from "../../../types/CodeableConcept";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getCodeableConcept = async (id: string | string[] | undefined) =>
  id
    ? await fetch<CodeableConcept>(`/codeable_concepts/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: { data: codeableconcept, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery<FetchResponse<CodeableConcept> | undefined>(
    ["codeableconcept", id],
    () => getCodeableConcept(id)
  );
  const codeableconceptData = useMercure(codeableconcept, hubURL);

  if (!codeableconceptData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show CodeableConcept ${codeableconceptData["@id"]}`}</title>
        </Head>
      </div>
      <Show codeableconcept={codeableconceptData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["codeableconcept", id], () =>
    getCodeableConcept(id)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<CodeableConcept>>(
    "/codeable_concepts"
  );
  const paths = await getItemPaths(
    response,
    "codeable_concepts",
    "/codeableconcepts/[id]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
