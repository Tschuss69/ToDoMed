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

import { Form } from "../../../components/practitionerrole/Form";
import { PagedCollection } from "../../../types/collection";
import { PractitionerRole } from "../../../types/PractitionerRole";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getPractitionerRole = async (id: string | string[] | undefined) =>
  id
    ? await fetch<PractitionerRole>(`/practitioner_roles/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: practitionerrole } = {} } = useQuery<
    FetchResponse<PractitionerRole> | undefined
  >(["practitionerrole", id], () => getPractitionerRole(id));

  if (!practitionerrole) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>
            {practitionerrole &&
              `Edit PractitionerRole ${practitionerrole["@id"]}`}
          </title>
        </Head>
      </div>
      <Form practitionerrole={practitionerrole} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["practitionerrole", id], () =>
    getPractitionerRole(id)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<PractitionerRole>>(
    "/practitioner_roles"
  );
  const paths = await getItemPaths(
    response,
    "practitioner_roles",
    "/practitionerroles/[id]/edit"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
