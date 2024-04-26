import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Encounter} from "@/types/Encounter";
import moment from "moment/moment";
import {Button} from "@/components/ui/Button";
import React from "react";
import Link from "next/link";
import {Task} from "@/types/Task";

export function TableEncounters({listeEncounters, onChangeEncounter}){

    function completionRate(taskArray: Task[]): number {
        let nbTaskCompleted: number = taskArray.filter(task => task.status === 'completed').length;
        return nbTaskCompleted/taskArray.length;
    }

  return(
    <Table>
      <TableCaption>{"Patients en attente d'intervention"}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead >Patient</TableHead>
          <TableHead>Intervention</TableHead>
          <TableHead>{"Date d'intervention"}</TableHead>
            <TableHead>{"Completion"}</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          listeEncounters.map((encounter: Encounter)=>
            <TableRow key={encounter['@id']}>
              <TableCell className="font-medium">{encounter?.subject?.name?.[0].text}</TableCell>
              <TableCell className="font-medium">{encounter?.type?.text}</TableCell>
              <TableCell>{moment(encounter.plannedStartDate).format('DD/MM/YYYY')}</TableCell>
                <TableCell>{encounter.tasks ? completionRate(encounter.tasks)*100 +' %' : null}</TableCell>
              <TableCell className={'space-x-4'}>
                <Button onClick={() => onChangeEncounter(encounter)}>Modifier</Button>
                <Link href={`${encounter['@id']}/practitioner`}><Button>Acceder</Button></Link>
              </TableCell>

            </TableRow>
          )
        }
      </TableBody>
    </Table>
  )
}
