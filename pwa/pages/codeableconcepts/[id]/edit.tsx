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

import { Form } from "../../../components/codeableconcept/Form";
import { PagedCollection } from "../../../types/collection";
import { CodeableConcept } from "../../../types/CodeableConcept";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getCodeableConcept = async (id: string | string[] | undefined) =>
  id
    ? await fetch<CodeableConcept>(`/codeable_concepts/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: codeableconcept } = {} } = useQuery<
    FetchResponse<CodeableConcept> | undefined
  >(["codeableconcept", id], () => getCodeableConcept(id));

  if (!codeableconcept) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>
            {codeableconcept &&
              `Edit CodeableConcept ${codeableconcept["@id"]}`}
          </title>
        </Head>
      </div>
      <Form codeableconcept={codeableconcept} />
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
    "/codeableconcepts/[id]/edit"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
