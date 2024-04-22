import {useState} from "react";
import {Patient} from "@/types/Patient";
import {PatientForm} from "@/components/patient/encounter/PatientForm";
import {EncounterForm} from "@/components/forms/EncounterForm";

export function CreateEncounter({patient, setOpen, encounter}:{patient: Patient | null}){

  const [etape, setEtape] = useState<number>(1);
  const [inpatient, setinPatient] = useState<Patient | null>(patient);

  if(etape === 1){
    return <PatientForm setEtape={setEtape} patient={patient} setPatient={setinPatient}/>
  }else if(etape === 2 && inpatient !== null){
    return <EncounterForm patient={inpatient} setOpen={setOpen} encounter={encounter} />
  }
}
