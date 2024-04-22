import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import Layout from "@/components/practitioner/PractitionerLayout";
import {useRouter} from "next/router";
import {useQuery} from "react-query";
import {FetchResponse} from "@/utils/dataAccess";
import {PagedCollection} from "@/types/collection";
import {Encounter} from "@/types/Encounter";
import {useMercure} from "@/utils/mercure";
import {getEncounters, getEncountersPath} from "@/api/encounter/fetch";
import {TableEncounters} from "@/components/encounter/TableEncounters";
import {CreateEncounter} from "@/components/encounter/CreateEncounter";
import {Patient} from "@/types/Patient";


export default function Page(){
  const [open, setOpen] = useState(false);
  const [encounterToChange, setEncounterToChange] = useState<Encounter | null>(null);
  const [patientToChange, setPatientToChange] = useState<Patient|null>(null);

  useEffect(() => {
    if(!open && encounterToChange){
      setEncounterToChange(null)
    }
  }, [open])

  const {
    query: { page },
  } = useRouter();

  const { data: { data: encounters, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Encounter>> | undefined
    >(getEncountersPath(page), getEncounters(page));

  const collection = useMercure(encounters, hubURL);

  const onChangeEncounter = (values: Encounter) => {
    setEncounterToChange(values);
    setPatientToChange(values.subject? values.subject : null)
    setOpen(true);
  }

  if (!collection || !collection["hydra:member"]) return null;

  return(
    <Layout>
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <Button onClick={() => setOpen(true)}>Ajouter une intervention</Button>

        <SheetContent>
          <SheetHeader>
            <SheetTitle>Nouvelle intervention</SheetTitle>
            <SheetDescription>
              <CreateEncounter patient={patientToChange} setOpen={setOpen} encounter={encounterToChange} />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <TableEncounters listeEncounters={collection["hydra:member"]} onChangeEncounter={onChangeEncounter} />
    </div>
    </Layout>
  )
}
