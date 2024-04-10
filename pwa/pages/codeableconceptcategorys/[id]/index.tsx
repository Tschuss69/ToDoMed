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

import { Show } from "../../../components/codeableconceptcategory/Show";
import { PagedCollection } from "../../../types/collection";
import { CodeableConceptCategory } from "../../../types/CodeableConceptCategory";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getCodeableConceptCategory = async (id: string | string[] | undefined) =>
  id
    ? await fetch<CodeableConceptCategory>(`/codeable_concept_categories/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: { data: codeableconceptcategory, hubURL, text } = {
      hubURL: null,
      text: "",
    },
  } = useQuery<FetchResponse<CodeableConceptCategory> | undefined>(
    ["codeableconceptcategory", id],
    () => getCodeableConceptCategory(id)
  );
  const codeableconceptcategoryData = useMercure(
    codeableconceptcategory,
    hubURL
  );

  if (!codeableconceptcategoryData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show CodeableConceptCategory ${codeableconceptcategoryData["@id"]}`}</title>
        </Head>
      </div>
      <Show codeableconceptcategory={codeableconceptcategoryData} text={text} />
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
    "/codeableconceptcategorys/[id]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
