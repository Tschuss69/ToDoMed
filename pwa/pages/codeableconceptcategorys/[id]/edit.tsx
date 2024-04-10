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

import { Form } from "../../../components/codeableconceptcategory/Form";
import { PagedCollection } from "../../../types/collection";
import { CodeableConceptCategory } from "../../../types/CodeableConceptCategory";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getCodeableConceptCategory = async (id: string | string[] | undefined) =>
  id
    ? await fetch<CodeableConceptCategory>(`/codeable_concept_categories/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: codeableconceptcategory } = {} } = useQuery<
    FetchResponse<CodeableConceptCategory> | undefined
  >(["codeableconceptcategory", id], () => getCodeableConceptCategory(id));

  if (!codeableconceptcategory) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>
            {codeableconceptcategory &&
              `Edit CodeableConceptCategory ${codeableconceptcategory["@id"]}`}
          </title>
        </Head>
      </div>
      <Form codeableconceptcategory={codeableconceptcategory} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["codeableconceptcategory", id], () =>
    getCodeableConceptCategory(id)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<CodeableConceptCategory>>(
    "/codeable_concept_categories"
  );
  const paths = await getItemPaths(
    response,
    "codeable_concept_categories",
    "/codeableconceptcategorys/[id]/edit"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
