import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "@/utils/dataAccess";
import { Patient } from "@/types/Patient";

interface Props {
  patient?: Patient;
}

interface SaveParams {
  values: Patient;
}

interface DeleteParams {
  id: string;
}

const savePatient = async ({ values }: SaveParams) =>
  await fetch<Patient>(!values["@id"] ? "/patients" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deletePatient = async (id: string) =>
  await fetch<Patient>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ patient }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Patient> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => savePatient(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Patient> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deletePatient(id), {
    onSuccess: () => {
      router.push("/patients");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!patient || !patient["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: patient["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/patients"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {patient ? `Edit Patient ${patient["@id"]}` : `Create Patient`}
      </h1>
      <Formik
        initialValues={
          patient
            ? {
                ...patient,
              }
            : new Patient()
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
                router.push("/patients");
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
              <div className="text-gray-700 block text-sm font-bold">name</div>
              <FieldArray
                name="name"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="patient_name">
                    {values.name && values.name.length > 0 ? (
                      values.name.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`name.${index}`} />
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
              <div className="text-gray-700 block text-sm font-bold">
                generalPractitioner
              </div>
              <FieldArray
                name="generalPractitioner"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="patient_generalPractitioner">
                    {values.generalPractitioner &&
                    values.generalPractitioner.length > 0 ? (
                      values.generalPractitioner.map(
                        (item: any, index: number) => (
                          <div key={index}>
                            <Field name={`generalPractitioner.${index}`} />
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
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="patient_email"
              >
                email
              </label>
              <input
                name="email"
                id="patient_email"
                value={values.email ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.email && touched.email ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.email && touched.email ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="email"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="patient_phone"
              >
                phone
              </label>
              <input
                name="phone"
                id="patient_phone"
                value={values.phone ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.phone && touched.phone ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.phone && touched.phone ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="phone"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="patient_gender"
              >
                gender
              </label>
              <input
                name="gender"
                id="patient_gender"
                value={values.gender ?? ""}
                type="text"
                placeholder=""
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
                htmlFor="patient_birthDate"
              >
                birthDate
              </label>
              <input
                name="birthDate"
                id="patient_birthDate"
                value={values.birthDate?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
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
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="patient_telecom"
              >
                telecom
              </label>
              <input
                name="telecom"
                id="patient_telecom"
                value={values.telecom ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.telecom && touched.telecom ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.telecom && touched.telecom ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="telecom"
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
        {patient && (
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
