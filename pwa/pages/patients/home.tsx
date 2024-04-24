import VideoComponent from "@/components/general/video/VideoComponent";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Layout from "@/components/patient/PatientLayout";
import {useQuery} from "react-query";
import {FetchResponse} from "@/utils/dataAccess";
import {useMercure} from "@/utils/mercure";
import {Patient} from "@/types/Patient";
import DefaultErrorPage from "next/error";
import {getPatient} from "@/api/patient/fetch";
import {Task} from "@/types/Task";
import {PanelExplications} from "@/components/patient/PanelExplications";

function TablePatientAction({listeAction}: {listeAction: Task[]}){
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
          listeAction.map((action:Task, key:number)=>
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


function ListeVideoPatient({listeAction}){
  return (
    <div className={'flex-1 grid grid-flow-col auto-cols-max'}>
      {
        listeAction.map(action=>
          <Card key={action.content.title} className="w-[350px]">
            <CardHeader>
              <CardTitle>{action.content.title}</CardTitle>
              <CardDescription>{action.content.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <VideoComponent url={action.content.url}/>
            </CardContent>
          </Card>
        )
      }
    </div>
  )
}



export default function Page(){
  const patientId = 56;

  const { data: { data: patient, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Patient> | undefined>(["patient", patientId], () =>
      getPatient(idpatientId)
    );
  const patientData: Patient = useMercure(patient, hubURL);

  if (!patientData) {
    return <DefaultErrorPage statusCode={404}/>;
  }

  const firstEncounter = patientData.encounters? patientData.encounters[0] : null;

  const tasks = firstEncounter ? firstEncounter.tasks : null;

  return(
    <Layout>
      <div>

        <PanelExplications/>
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:px-20">
          <h1 className={'text-xl text-center font-medium text-gray-800 md:text-3xl md:leading-normal'}><strong>Ce que vous devez faire avant l'hospitalisation</strong></h1>
        </div>
        <TablePatientAction listeEncounters={tasks}/>
      </div>
    </Layout>
  )
}
