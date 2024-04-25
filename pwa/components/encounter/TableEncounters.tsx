import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Encounter} from "@/types/Encounter";
import moment from "moment/moment";
import {Button} from "@/components/ui/Button";
import React from "react";
import Link from "next/link";

export function TableEncounters({listeEncounters, onChangeEncounter}){

  return(
    <Table>
      <TableCaption>{"Patients en attente d'intervention"}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead >Patient</TableHead>
          <TableHead>Intervention</TableHead>
          <TableHead>{"Date d'intervention"}</TableHead>
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
              <TableCell>
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
