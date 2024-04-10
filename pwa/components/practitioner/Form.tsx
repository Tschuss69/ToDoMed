import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Practitioner } from "../../types/Practitioner";
import {Button} from "../ui/Button";

interface Props {
  practitioner?: Practitioner;
}

interface SaveParams {
  values: Practitioner;
}

interface DeleteParams {
  id: string;
}

const savePractitioner = async ({ values }: SaveParams) =>
  await fetch<Practitioner>(!values["@id"] ? "/practitioners" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deletePractitioner = async (id: string) =>
  await fetch<Practitioner>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ practitioner }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Practitioner> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => savePractitioner(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Practitioner> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deletePractitioner(id), {
    onSuccess: () => {
      router.push("/practitioners");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!practitioner || !practitioner["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: practitioner["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/practitioners"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {practitioner
          ? `Edit Practitioner ${practitioner["@id"]}`
          : `Create Practitioner`}
      </h1>
      <Button>Deploy</Button>
      <Formik
        initialValues={
          practitioner
            ? {
                ...practitioner,
              }
            : {
              names : [
                {
                  family : '',
                  given: ''
                },
            ]
            }
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
                router.push("/practitioners");
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
                htmlFor="humanname_family"
              >
                family
              </label>
              <input
                name="names.0.family"
                id="humanname_family"
                value={values?.names[0]?.family ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors?.names && errors?.names[0]?.family && touched.names[0].family ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors?.names && errors?.names[0]?.family && touched.names[0].family ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="names.0.family"
              />
            </div>


            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="practitioner_gender"
              >
                gender
              </label>
              <input
                name="gender"
                id="practitioner_gender"
                value={values.gender ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.gender && touched.gender ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.gender && touched.gender ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="gender"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="practitioner_birthDate"
              >
                birthDate
              </label>
              <input
                name="birthDate"
                id="practitioner_birthDate"
                value={values.birthDate?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.birthDate && touched.birthDate ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.birthDate && touched.birthDate ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="birthDate"
              />
            </div>
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">
                practitionerRoles
              </div>
              <FieldArray
                name="practitionerRoles"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="practitioner_practitionerRoles">
                    {values.practitionerRoles &&
                    values.practitionerRoles.length > 0 ? (
                      values.practitionerRoles.map(
                        (item: any, index: number) => (
                          <div key={index}>
                            <Field name={`practitionerRoles.${index}`} />
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
                        )
                      )
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
        {practitioner && (
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
