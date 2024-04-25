import {Task} from "@/types/Task";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Link from "next/link";
import {Button} from "@/components/ui/Button";

const statusToText = {
  'requested' : 'A faire',
  'in-progress': 'En cours',
  'completed': 'Fait',
  'cancelled': 'Annulé'
}


export function TableTasksPractitioner({tasks}: {tasks: Task[]}){

  const correspondanceContentUrl = {
    telesuivi : "telesuivi",
    complication : "risques",
    intervention: "intervention",
    initial: "interet"
  }

  console.log(tasks)
  return(
    <Table>
      <TableCaption>Liste des actions à réaliser</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead></TableHead>

        </TableRow>
      </TableHeader>
      <TableBody>
        {
          tasks.map((action:Task, key:number)=>
            <TableRow key={action["@id"]}>
              <TableCell>{action.description}</TableCell>
              <TableCell>{action.status ? statusToText[action.status] : null}</TableCell>
            </TableRow>
          )
        }

      </TableBody>
    </Table>
  )
}
