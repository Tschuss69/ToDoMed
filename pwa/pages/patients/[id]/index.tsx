import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { PagedCollection } from "@/types/collection";
import { Patient } from "@/types/Patient";
import { fetch, FetchResponse, getItemPaths } from "@/utils/dataAccess";
import { useMercure } from "@/utils/mercure";
import Layout from "@/components/patient/PatientLayout";
import {DashboardPatient} from "@/components/patient/DashboardPatient";
import {PanelExplications} from "@/components/patient/PanelExplications";
import {jwtDecode} from "jwt-decode";
import {useState} from "react";

const getPatient = async (id: string | string[] | undefined) =>
  id ? await fetch<Patient>(`/patients/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: patient, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Patient> | undefined>(["patient", id], () =>
      getPatient(id)
    );


  const patientData = useMercure(patient, hubURL);
  console.log('patientData')
  console.log(patientData)



  if (!patientData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Patient ${patientData["@id"]}`}</title>
        </Head>
      </div>
      <Layout>
        <PanelExplications/>
        <DashboardPatient patientId={patientData['id']}/>
      </Layout>

    </div>
  );
};





export default Page;
