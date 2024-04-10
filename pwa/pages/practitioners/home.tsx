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
import {EncounterForm} from "@/components/forms/EncounterForm";
import {useRouter} from "next/router";
import {dehydrate, QueryClient, useQuery} from "react-query";
import {FetchResponse} from "@/utils/dataAccess";
import {PagedCollection} from "@/types/collection";
import {Encounter} from "@/types/Encounter";
import {useMercure} from "@/utils/mercure";
import {getEncounters, getEncountersPath} from "@/api/encounter/fetch";
import {TableEncounters} from "@/components/encounter/TableEncounters";



export default function Page(){
  const [open, setOpen] = useState(false);
  const [valueToChange, setValuesToChange] = useState<Encounter | null>()

  useEffect(() => {
    if(!open && valueToChange){
      setValuesToChange(null)
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
    setValuesToChange(values);
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
             <EncounterForm setOpen={setOpen} encounter={valueToChange ? valueToChange : null}/>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <TableEncounters listeEncounters={collection["hydra:member"]} onChangeEncounter={onChangeEncounter}/>
    </div>
    </Layout>
  )
}
