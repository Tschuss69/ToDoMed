import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "@/utils/dataAccess";
import { Encounter } from "@/types/Encounter";

interface Props {
  encounter?: Encounter;
}

interface SaveParams {
  values: Encounter;
}

interface DeleteParams {
  id: string;
}

const saveEncounter = async ({ values }: SaveParams) =>
  await fetch<Encounter>(!values["@id"] ? "/encounters" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteEncounter = async (id: string) =>
  await fetch<Encounter>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ encounter }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Encounter> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveEncounter(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Encounter> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteEncounter(id), {
    onSuccess: () => {
      router.push("/encounters");
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

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/encounters"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {encounter ? `Edit Encounter ${encounter["@id"]}` : `Create Encounter`}
      </h1>
      <Formik
        initialValues={
          encounter
            ? {
                ...encounter,
              }
            : new Encounter()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
                router.push("/encounters");
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
        }}
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
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="encounter_status"
              >
                status
              </label>
              <input
                name="status"
                id="encounter_status"
                value={values.status ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.status && touched.status ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.status && touched.status ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="status"
              />
            </div>
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">
                subject
              </div>
              <FieldArray
                name="subject"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="encounter_subject">
                    {values.subject && values.subject.length > 0 ? (
                      values.subject.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`subject.${index}`} />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => arrayHelpers.insert(index, "")}
                          >
                            +
                          </button>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                      >
                        Add
                      </button>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="encounter_plannedStartDate"
              >
                plannedStartDate
              </label>
              <input
                name="plannedStartDate"
                id="encounter_plannedStartDate"
                value={values.plannedStartDate?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.plannedStartDate && touched.plannedStartDate
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.plannedStartDate && touched.plannedStartDate
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="plannedStartDate"
              />
            </div>
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">type</div>
              <FieldArray
                name="type"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="encounter_type">
                    {values.type && values.type.length > 0 ? (
                      values.type.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`type.${index}`} />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => arrayHelpers.insert(index, "")}
                          >
                            +
                          </button>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                      >
                        Add
                      </button>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">actor</div>
              <FieldArray
                name="actor"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="encounter_actor">
                    {values.actor && values.actor.length > 0 ? (
                      values.actor.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`actor.${index}`} />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => arrayHelpers.insert(index, "")}
                          >
                            +
                          </button>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                      >
                        Add
                      </button>
                    )}
                  </div>
                )}
              />
            </div>
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
            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <div className="flex space-x-2 mt-4 justify-end">
        {encounter && (
          <button
            className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
