import React, {useState} from "react";
import {LoginPatientForm} from "@/components/login/LoginPatientForm";
import { useRouter } from 'next/navigation'
import {LoginParams, postLogin} from "@/api/auth/fetch";
import {jwtDecode} from "jwt-decode";


function Page(){

  const router = useRouter()
  const [error, setError]  =useState<'non' | 'oui'>('non');

  async function handleSubmit(values: LoginParams) {

    setError('non')
    await postLogin(values).then((response) => {


      const token = response.data.token;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(response.data.token);
      localStorage.setItem('user_id', decoded['user_id']);
      console.log(decoded);

      if (decoded.roles.includes('ROLE_PRACTITIONER')) {
        router.push('/practitioners/home');
      } else if (decoded.roles.includes('ROLE_PATIENT')) {
        router.push('/patients/'+decoded['user_id']);
      }
    })
      .catch(err => {
        setError('oui');

      });
  }

  return(
    <LoginPatientForm submitFunction={handleSubmit} error={error}/>
  )
}


export default Page;
