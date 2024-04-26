import {Task} from "@/types/Task";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";



export function TableTasksPractitioner({tasks}: {tasks: Task[]}){

  function displayStatus(status : string){
      if(status === 'completed'){
          return <Badge variant="outline">Fait</Badge>
      }else if(status === 'requested'){
          return <Badge variant="destructive">A faire</Badge>
      }
  }

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
              <TableCell>{action.status ? displayStatus(action.status) : null}</TableCell>
            </TableRow>
          )
        }

      </TableBody>
    </Table>
  )
}
