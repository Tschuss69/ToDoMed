import {ErrorMessage, Field, Formik} from "formik";
import {InputFormik} from "@/components/ui/form/InputFormik";
import {DateFormikInput} from "@/components/ui/form/DateFormikInput";
import {Button} from "@/components/ui/Button";
import React, {useState} from "react";
import {useMutation} from "react-query";
import {FetchError, FetchResponse} from "@/utils/dataAccess";
import {Patient} from "@/types/Patient";
import {savePatient} from "@/api/patient/fetch";
import {CalendarFormik} from "@/components/ui/form/CalendarFormik";

interface SaveParams {
  values: Patient;
}



export function PatientForm({setEtape, patient, setPatient}){

  const [, setError] = useState<string | null>(null);

  const patient_initial = {
    name: [{
      use: 'usual',
      family: '',
    }]
  }

  const saveMutation = useMutation<
    FetchResponse<Patient> | undefined,
    Error | FetchError,
    SaveParams
    >((saveParams) => savePatient(saveParams), {
    onMutate: (variables) => {
      console.log(variables)
    }
  });



  async function onHandleSubmit(values, {setSubmitting, setStatus, setErrors}){
    const isCreation = !values["@id"];

    if(isCreation){
      values['password'] = values.name[0].family.toLowerCase();
    }

    saveMutation.mutate(
      {values},
      {
        onSuccess: (response) => {
          setPatient(response.data)
          setEtape(2)
          setStatus({
            isValid: true,
            msg: `Element ${isCreation ? "created" : "updated"}.`,
          });
        },
        onError: (error) => {
          setStatus({
            isValid: false,
            msg: `${error.message}`,
          });
          if ("fields" in error) {
            setErrors(error.fields);
          }
        },
        onSettled: () => {
          setSubmitting(false);
        },
      }
    );
  }


  return(
    <div className="container mx-auto px-4 max-w-2xl mt-4">

      <Formik
        initialValues={
          patient
            ? {
              ...patient,
            }
            : patient_initial
        }
        //validationSchema={EncounterShape}
        onSubmit={onHandleSubmit}
      >
        {({
            values,
            status,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => {
          return(
            <form  onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">

                <Field id={`patient_family_0`} name={`name.0.family`} as={InputFormik} type={'string'}
                       placeholder="Nom" label={"Nom du patient"}/>
                <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name={`name.0.family`}/>

                <Field id={`patient_given_0`} name={`name.0.given.0`} as={InputFormik} type={'string'}
                       placeholder="Prénom" label={"Prénom du patient"}/>
                <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name={`name.0.given.0`}/>


                <Field id="patient_email" name="email" as={InputFormik} type={'email'} placeholder="E-mail"
                       label={"E-mail du patient"}/>
                <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name="email"/>

                <Field id="patient_birthDate" name="birthdate" as={DateFormikInput} type='dateTime'
                       placeholder="JJ/MM/AAAA" label={'Date de naissance'}/>
                <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name="birthdate"/>

                {status && status.msg && (
                  <div
                    className={`border px-4 py-3 my-4 rounded ${
                      status.isValid
                        ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                        : "text-red-700 border-red-400 bg-red-100"
                    }`}
                    role="alert"
                  >
                    {status.msg}
                  </div>
                )}
                <Button type={"submit"}>Enregister</Button>
              </div>
            </form>
          )
        }}
      </Formik>
    </div>
  );
}
