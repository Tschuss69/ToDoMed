import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/Card";
import {InputFormik} from "@/components/ui/form/InputFormik";
import {Button} from "@/components/ui/Button";
import React from "react";
import {Field, Form, Formik} from "formik";

export function LoginPatientForm({submitFunction, error}){

  return(
    <div className={'absolute top-100 w-screen h-screen pt-24'}>
      <Formik
        initialValues={{
          username: '',
          password:'',
        }}
        onSubmit={async (values) => {
          await submitFunction(values);
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
                  <Field name="username" as={InputFormik} placeholder="E-mail" label={'Email'}/>
                  <Field name="password" type={'password'} as={InputFormik} placeholder="Mot de passe" label={'Mot de passe'}/>
                  {error === 'oui' ?  <Button>Mauvais identifiants</Button>: null}
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
