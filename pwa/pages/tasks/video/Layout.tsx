import Link from "next/link";
import {Button} from "@/components/ui/Button";
import React from "react";
import Layout from "@/components/patient/PatientLayout";

export default function LayoutTask({ children }: { children: React.ReactNode }){
  return(
    <Layout>
      <div>
        <div className={'p-5'}>
          <Link href={`/patients/home`}><Button>Retour</Button></Link>
        </div>
        { children }
      </div>
    </Layout>
  )


}
