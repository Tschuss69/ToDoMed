import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Encounter} from "@/types/Encounter";
import moment from "moment/moment";
import {Button} from "@/components/ui/Button";
import React from "react";
import Link from "next/link";


export function PatientTableEncounters({listeEncounters}: {listeEncounters : Encounter[]}){

  return(
    <Table>
      <TableCaption>{"Patients en attente d'intervention"}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Intervention</TableHead>
          <TableHead>{"Date d'intervention"}</TableHead>
          <TableHead>Ouvrir</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          listeEncounters ? listeEncounters.map((encounter: Encounter)=>
            <TableRow key={encounter['@id']}>
              <TableCell className="font-medium">{encounter?.type?.text}</TableCell>
              <TableCell>{moment(encounter.plannedStartDate).format('DD/MM/YYYY')}</TableCell>
              <TableCell><Link href={`${encounter['@id']}/patient`}><Button>Ouvrir</Button></Link></TableCell>
            </TableRow>
          ) : null
        }
      </TableBody>
    </Table>
  )
}
