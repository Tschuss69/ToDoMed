import {Task} from "@/types/Task";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Link from "next/link";
import {Button} from "@/components/ui/Button";

export function TableTasksPatient({tasks}: {tasks: Task[]}){
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
          tasks.map((action:Task, key:number)=>
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
