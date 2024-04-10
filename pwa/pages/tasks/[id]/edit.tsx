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

import { Form } from "../../../components/task/Form";
import { PagedCollection } from "../../../types/collection";
import { Task } from "../../../types/Task";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getTask = async (id: string | string[] | undefined) =>
  id ? await fetch<Task>(`/tasks/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: task } = {} } = useQuery<
    FetchResponse<Task> | undefined
  >(["task", id], () => getTask(id));

  if (!task) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{task && `Edit Task ${task["@id"]}`}</title>
        </Head>
      </div>
      <Form task={task} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["task", id], () => getTask(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Task>>("/tasks");
  const paths = await getItemPaths(response, "tasks", "/tasks/[id]/edit");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
