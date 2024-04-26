import React, {FunctionComponent, useState} from "react";
import {useMutation} from "react-query";
import {FetchError, FetchResponse} from "@/utils/dataAccess";
import {Patient} from "@/types/Patient";
import {ErrorMessage, Field, Formik} from "formik";
import {DateFormikInput} from "@/components/ui/form/DateFormikInput";
import {Button} from "@/components/ui/Button";
import {deleteEncounter, saveEncounter} from "@/api/encounter/fetch";
import {Encounter} from "@/types/Encounter";
import {Task} from "@/types/Task";



const initialTask = (title: string, content: 'initial' | 'intervention' | 'complication' | 'telesuivi', description: string): Task => {
  return(
    {
      title: title,
      status: 'requested',
      priority: 'routine',
      description: description,
      content: content,
    }
  )
}


const encounter_initial = {
  status: 'unknown',
  type: "/codeable_concepts/1",
  tasks:[
    initialTask('Dois-je demander un télé-suivi ?', 'telesuivi', "Nous vous expliquons dans cette vidéo à quoi correspond le télésuivi et en quoi cette option peut être bénéfique pour vous."),
    initialTask("Quels sont les risques de l'intervention ?", "complication", "Quels sont les complications potentielles de la pose d'un pace maker ? "),
    initialTask("La pose d'un pace maker c'est quoi ?", "intervention", "Nous vous expliquons comment va se dérouler la pose d'un pace maker"),
    initialTask("Introduction", "initial", "Pourquoi cette plateforme ?")
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


export const EncounterForm: FunctionComponent<Props> = ({ setOpen, encounter, patient}) => {

  const [, setError] = useState<string | null>(null);

  const saveMutation = useMutation<
    FetchResponse<Patient> | undefined,
    Error | FetchError,
    SaveParams
    >((saveParams) => saveEncounter(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Encounter> | undefined,
    Error | FetchError,
    DeleteParams
    >(({ id }) => deleteEncounter(id), {
    onSuccess: (response) => {
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


    if(!patient) return console.log("il n'y a pas de patient");

    values.subject = patient["@id"];

    saveMutation.mutate(
      {values},
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
