import {LocalVideo} from "@/components/general/video/LocalVideo";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";
import moment from "moment";
import LayoutTask from "@/pages/tasks/video/Layout";

const action = {
  id: 1,
  type: 'CodeableConcept[Video à voir]',
  content: {
    title: "Le télé-suivi ? C'est quoi ? Pourquoi ?",
    description: "Apprenez en quoi le télé-suivi peut voue être utile.",
    url: '/a_quoi_sert_un_pacemaker.mp4',
  },
  status: 'toDo | Done',
  relativeDate: -1, // nb jour par rapport à la date de l'intervention
  deadlineDate: moment().format('DD/MM/YYYY') // Soit relative date soit deadlineDate
};

export default function Page(){
  return(
    <LayoutTask>
      <Card>
        <CardHeader>
          <CardTitle className={'pb-2'}>{action.content.title}</CardTitle>
          <CardDescription>{action.content.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <LocalVideo url={action.content.url} />
        </CardContent>
      </Card>
    </LayoutTask>
  );
}

/*
*
* <CardFooter className="flex justify-center">
          A voir avant le {moment().format('DD/MM/YYYY')}
        </CardFooter>
* */

