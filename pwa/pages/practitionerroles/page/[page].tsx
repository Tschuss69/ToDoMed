import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getPractitionerRoles,
  getPractitionerRolesPath,
} from "../../../components/practitionerrole/PageList";
import { PagedCollection } from "../../../types/collection";
import { PractitionerRole } from "../../../types/PractitionerRole";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    getPractitionerRolesPath(page),
    getPractitionerRoles(page)
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
  const paths = await getCollectionPaths(
    response,
    "practitioner_roles",
    "/practitionerroles/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
