'use client'

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/Card";
import {InputFormik} from "@/components/ui/form/InputFormik";
import {BirthDateFormikInput} from "@/components/ui/form/DateFormikInput";
import {Button} from "@/components/ui/Button";
import React from "react";
import {Field, Form, Formik} from "formik";

export function LoginPatientForm({submitFunction}){

  return(
    <div className={'absolute top-100 w-screen h-screen pt-24'}>
      <Formik
        initialValues={{
          email: '',
          birthdate:'',
        }}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 500));
          submitFunction();
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <Form>
          <div className={'flex justify-center'}>
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle className={'pb-2'}>Bienvenu sur votre plateforme d'informations </CardTitle>
                <CardDescription>Veuillez vous connecter pour accéder à votre espace personnel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <Field name="email" as={InputFormik} placeholder="E-mail" label={'Email'}/>
                  <Field name="birthdate" as={BirthDateFormikInput} placeholder="JJ/MM/AAAA" label={'Date de naissance'}/>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button >Connexion</Button>
              </CardFooter>
            </Card>
          </div>
        </Form>
      </Formik>
    </div>

  )
}
