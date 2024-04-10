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

const actions = [
  {
    id: "interet",
    type: 'video',
    content: {
      title: 'A quoi sert un pace maker ?',
      description: 'Cette vidéo vous explique à quoi sert un pace maker',
      url: 'url'
    },
    status: 'ToDo',
    deadlineDate: '23/04/2024'
  },
  {
    id: "intervention",
    type: 'video',
    content: {
      title: "Comment se déroule l'intervention ?",
      description: "Explications des étapes d'une pause de pace maker",
      url: 'url'
    },
    status: 'ToDo',
    deadlineDate: '23/04/2024'
  },
  {
    id: "risques",
    type: 'video',
    content: {
      title: "Les risques de l'intervention",
      description: "Nous vous expliquons les risques de l'intervention",
      url: 'url'
    },
    status: 'ToDo',
    deadlineDate: '23/04/2024'
  },
  {
    id: "telesuivi",
    type: 'video',
    content: {
      title: "Le Télésuivi c'est quoi ?",
      description: "Nous vous expliquons à quoi peut servir le télé suivi",
      url: 'url'
    },
    status: 'ToDo',
    deadlineDate: '23/04/2024'
  },
]


const actionsTable = [
  {
    title: 'A quoi sert un pace maker ?',
    description: 'Cette vidéo vous explique à quoi sert un pace maker',
    url: 'url'
  },
  {
    title: "Comment se déroule l'intervention ?",
    description: "Explications des étapes d'une pause de pace maker",
    url: 'url'
  },
  {
    title: "Les risques de l'intervention",
    description: "Nous vous expliquons les risques de l'intervention",
    url: 'url'
  },
  {
    title: "Le Télésuivi c'est quoi ?",
    description: "Nous vous expliquons à quoi peut servir le télé suivi",
    url: 'url'
  },
]

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

function PanelExplication(){
  return(
    <div className="mb-10 flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:px-20">
      <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
        <strong>Bienvenue dans votre Espace Personnel</strong>
      </p>
      <p className={'text-lg'}>
        Cet espace vous est dédié pour <strong>préparer votre intervention</strong>. Vous y trouverez des <strong>vidéos explicatives</strong> sur votre intervention et votre hospitalisation. Nous vous invitons à les visionner et vous pouvez revenir sur votre espace pour les revoir à tout moment.
      </p>

      <p className={'text-lg'}>
        Merci également de <strong>remplir les formulaires</strong> nécessaires à votre dossier médical. Ceux-ci sont cruciaux pour une prise en charge adaptée et sécurisée.
      </p>

      <p className={'text-lg'}>
        Votre préparation et votre compréhension sont clés pour nous. Ensemble, faisons de cette étape une réussite.
      </p>

    </div>
  );
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

        <PanelExplication/>
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:px-20">
          <h1 className={'text-xl text-center font-medium text-gray-800 md:text-3xl md:leading-normal'}><strong>Ce que vous devez faire avant l'hospitalisation</strong></h1>
        </div>
        <TablePatientAction listeEncounters={tasks}/>
      </div>
    </Layout>
  )
}
