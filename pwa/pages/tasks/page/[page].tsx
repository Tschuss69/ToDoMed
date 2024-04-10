import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getTasks,
  getTasksPath,
} from "../../../components/task/PageList";
import { PagedCollection } from "../../../types/collection";
import { Task } from "../../../types/Task";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getTasksPath(page), getTasks(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Task>>("/tasks");
  const paths = await getCollectionPaths(
    response,
    "tasks",
    "/tasks/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
