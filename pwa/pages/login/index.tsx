import React from "react";
import {LoginPatientForm} from "@/components/login/LoginPatientForm";


import { useRouter } from 'next/navigation'

export default function Page(){

  const router = useRouter()

  const authentification = async () => {
    return router.push('/patient')
  }

  return(
    <LoginPatientForm submitFunction={authentification}/>
  )
}
