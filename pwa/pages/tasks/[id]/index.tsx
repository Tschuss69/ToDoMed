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

import { Show } from "../../../components/task/Show";
import { PagedCollection } from "../../../types/collection";
import { Task } from "../../../types/Task";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getTask = async (id: string | string[] | undefined) =>
  id ? await fetch<Task>(`/tasks/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: task, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Task> | undefined>(["task", id], () => getTask(id));
  const taskData = useMercure(task, hubURL);

  if (!taskData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Task ${taskData["@id"]}`}</title>
        </Head>
      </div>
      <Show task={taskData} text={text} />
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
  const paths = await getItemPaths(response, "tasks", "/tasks/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
