import {Encounter} from "@/types/Encounter";
import {PatientTableEncounters} from "@/components/encounter/PatientTableEncounters";
import {useQuery} from "react-query";
import {FetchResponse} from "@/utils/dataAccess";
import {useMercure} from "@/utils/mercure";
import {getEncountersByPatient} from "@/api/patient/fetch";



export function DashboardPatient({patientId} : {patientId : number}){

  const {
    data: { data: encounter, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery(["encounterbypatient", patientId], () =>
    getEncountersByPatient(56)
  );
  const encounters = useMercure(encounter, hubURL);

  console.log('encounters')
  console.log(encounters)
  console.log(data)


  return(
    <PatientTableEncounters listeEncounters={encounters}></PatientTableEncounters>
  )
}
