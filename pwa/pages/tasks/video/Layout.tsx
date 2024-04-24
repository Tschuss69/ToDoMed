import Link from "next/link";
import {Button} from "@/components/ui/Button";
import React from "react";
import Layout from "@/components/patient/PatientLayout";
import {useRouter} from "next/router";

export default function LayoutTask({ children }: { children: React.ReactNode }){

  const router = useRouter();

  return(
    <Layout>
      <div>
        <div className={'p-5'}>
          <Button onClick={router.back}>Retour</Button>
        </div>
        { children }
      </div>
    </Layout>
  )


}
