import {
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { Encounter } from "@/types/Encounter";
import { fetch, FetchResponse } from "@/utils/dataAccess";
import { useMercure } from "@/utils/mercure";
import Layout from "@/components/patient/PatientLayout";
import {TableTasksPatient} from "@/components/task/TableTasksPatient";
import {PanelExplications} from "@/components/patient/PanelExplications";
import {TableTasksPractitioner} from "@/components/task/TableTasksPractitioner";
import {Button} from "@/components/ui/Button";

const getEncounter = async (id: string | string[] | undefined) =>
  id ? await fetch<Encounter>(`/encounters/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: { data: encounter, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery<FetchResponse<Encounter> | undefined>(["encounter", id], () =>
    getEncounter(id)
  );
  const encounterData = useMercure(encounter, hubURL);

  if (!encounterData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Encounter ${encounterData["@id"]}`}</title>
        </Head>
      </div>

      <Layout>
        <Button onClick={() => router.back()}>Retour</Button>
        <TableTasksPractitioner tasks={encounterData.tasks}/>
      </Layout>
    </div>
  );
};

export default Page;
