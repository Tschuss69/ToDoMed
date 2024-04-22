import {PatientTableEncounters} from "@/components/encounter/PatientTableEncounters";
import {useQuery} from "react-query";
import {getEncountersByPatient} from "@/api/patient/fetch";
import {Encounter} from "@/types/Encounter";
import {useRouter} from "next/router";

export function DashboardPatient({patientId} : {patientId : number}){

  const router = useRouter();
  const { isLoading, isError, data, error } = useQuery({ queryKey: ["encounterbypatient", patientId], queryFn: getEncountersByPatient(patientId) })

  if (isLoading) {
    return <span>Loading...</span>
  }
  if (isError) {
    return <span>Error: {error.message}</span>
  }

  const encounters : Encounter[] | undefined = data?.data;

  if(!encounters) return null;

  if(encounters.length === 1)  router.push(`/encounters/${encounters[0]['id']}/patient`)

  return(
    <PatientTableEncounters listeEncounters={encounters}></PatientTableEncounters>
  )
}
