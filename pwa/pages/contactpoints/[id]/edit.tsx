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

import { Form } from "../../../components/contactpoint/Form";
import { PagedCollection } from "../../../types/collection";
import { ContactPoint } from "../../../types/ContactPoint";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getContactPoint = async (id: string | string[] | undefined) =>
  id
    ? await fetch<ContactPoint>(`/contact_points/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: contactpoint } = {} } = useQuery<
    FetchResponse<ContactPoint> | undefined
  >(["contactpoint", id], () => getContactPoint(id));

  if (!contactpoint) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>
            {contactpoint && `Edit ContactPoint ${contactpoint["@id"]}`}
          </title>
        </Head>
      </div>
      <Form contactpoint={contactpoint} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["contactpoint", id], () =>
    getContactPoint(id)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<ContactPoint>>(
    "/contact_points"
  );
  const paths = await getItemPaths(
    response,
    "contact_points",
    "/contactpoints/[id]/edit"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
