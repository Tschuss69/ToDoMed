import React, {FunctionComponent, useState} from "react";
import {useRouter} from "next/router";
import {useMutation} from "react-query";
import {FetchError, FetchResponse} from "@/utils/dataAccess";
import {Patient} from "@/types/Patient";
import {ErrorMessage, Field, Formik} from "formik";
import {DateFormikInput} from "@/components/ui/form/DateFormikInput";
import {InputFormik} from "@/components/ui/form/InputFormik";
import {Button} from "@/components/ui/Button";
import {deleteEncounter, saveEncounter} from "@/api/encounter/fetch";
import {Encounter} from "@/types/Encounter";
import {Task} from "@/types/Task";


const patient_preInitialValue = {
  gender : "unknown"
};

const patient_initial: Patient = {
  name: [{
    use: 'usual',
    family: '',
  }]
}

const apiform = {
  "status": "unknown",
  "subject": {
    "name": [
      {
        "use": "usual",
        "family": "schaaf",
        "given": [
          "mathieu"
        ]
      }],
      "email": "mathieu.schaaf@gmail.com"
  },
  "type": "/codeable_concepts/1",
  "plannedStartDate": "2024-04-04T03:26:51.780Z"
}

const initialTask = (content: 'initial' | 'intervention' | 'complication' | 'telesuivi'): Task => {
  return(
    {
      status: 'requested',
      priority: 'routine',
      description: 'Video à regarder',
      completionRate: 0,
      content: content,
    }
  )
}


const encounter_initial: Encounter = {
  status: 'unknown',
  subject: patient_initial,
  type: "/codeable_concepts/1",
  tasks:[
    initialTask("initial"), initialTask("intervention"), initialTask("complication"), initialTask('telesuivi')
  ]
};

interface Props {
  encounter?: Encounter;
}

interface SaveParams {
  values: Encounter;
}

interface DeleteParams {
  id: string;
}


export const EncounterForm: FunctionComponent<Props> = ({ setOpen, encounter }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Patient> | undefined,
    Error | FetchError,
    SaveParams
    >((saveParams) => saveEncounter(saveParams), {
      onSuccess: () =>  setOpen(false)});

  const deleteMutation = useMutation<
    FetchResponse<Encounter> | undefined,
    Error | FetchError,
    DeleteParams
    >(({ id }) => deleteEncounter(id), {
    onSuccess: () => {
      setOpen(false)
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!encounter || !encounter["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: encounter["@id"] });
  };


  const onHandleSubmit = (values, { setSubmitting, setStatus, setErrors }) => {
    const isCreation = !values["@id"];

    console.log(values)
    saveMutation.mutate(
      { values },
      {
        onSuccess: () => {
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


  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">

      <Formik
        initialValues={
          encounter
            ? {
              ...encounter,
            }
            : encounter_initial
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

              <Field id={`subject_patient_family_0`} name={`subject.name.0.family`} as={InputFormik} type={'string'}
                     placeholder="Nom" label={"Nom du patient"}/>
              <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name={`subject.name.0.family`}/>

              <Field id={`subject_patient_given_0`} name={`subject.name.0.given.0`} as={InputFormik} type={'string'}
                     placeholder="Prénom" label={"Prénom du patient"}/>
              <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name={`name.0.given.0`}/>


              <Field id="subject_patient_email" name="subject.email" as={InputFormik} type={'email'} placeholder="E-mail"
                     label={"E-mail du patient"}/>
              <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name="subject.email"/>

              <Field id="subject_patient_birthDate" name="subject.birthdate" as={DateFormikInput} type='dateTime'
                     placeholder="JJ/MM/AAAA" label={'Date de naissance'}/>
              <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name="subject.birthdate"/>

                <Field id="encounter_plannedStartDate" name="plannedStartDate" as={DateFormikInput} type='dateTime'
                       placeholder="JJ/MM/AAAA" label={"Date de l'intervention"}/>
                <ErrorMessage className="text-xs text-red-500 pt-1" component="div" name="plannedStartDate"/>

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
                {encounter && encounter['@id'] ? <Button onClick={handleDelete}>Supprimer</Button> : null}
              </div>
            </form>
          )
        }}
      </Formik>
    </div>
  );
};
