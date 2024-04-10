import {Task} from "@/types/Task";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Link from "next/link";
import {Button} from "@/components/ui/Button";
import {useRouter} from "next/router";
import {dehydrate, QueryClient, useQuery} from "react-query";
import {FetchResponse} from "@/utils/dataAccess";
import {useMercure} from "@/utils/mercure";
import {GetStaticProps} from "next";
import {getTasks, getTasksPath} from "@/api/task/fetch";
import {PagedCollection} from "@/types/collection";

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getTasksPath(), getTasks());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};


export function Page(){

  const {
    query: { page },
  } = useRouter();
  const { data: { data: tasks, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Task>> | undefined
    >(getTasksPath(page), getTasks(page));
  const collection = useMercure(tasks, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return(
    <Table>
      <TableCaption>Liste des actions à réaliser</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Type</TableHead>
          <TableHead>Titre</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Action</TableHead>

        </TableRow>
      </TableHeader>
      <TableBody>
        {
          collection["hydra:member"].map((action:Task, key:number)=>
            <TableRow key={action["@id"]}>
              <TableCell className="font-medium">Vidéo</TableCell>
              <TableCell className="font-medium">Vidéo à regarder</TableCell>
              <TableCell>{action.description}</TableCell>
              <TableCell>{action.status}</TableCell>
              <TableCell className="text-right"><Link href={`/tasks/video/${key+1}`}><Button>Ouvrir</Button></Link></TableCell>
            </TableRow>

          )
        }

      </TableBody>
    </Table>
  )
}

