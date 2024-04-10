import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { HumanName } from "../../types/HumanName";

interface Props {
  humanname?: HumanName;
}

interface SaveParams {
  values: HumanName;
}

interface DeleteParams {
  id: string;
}

const saveHumanName = async ({ values }: SaveParams) =>
  await fetch<HumanName>(!values["@id"] ? "/human_names" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteHumanName = async (id: string) =>
  await fetch<HumanName>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ humanname }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<HumanName> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveHumanName(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<HumanName> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteHumanName(id), {
    onSuccess: () => {
      router.push("/humannames");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!humanname || !humanname["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: humanname["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/humannames"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {humanname ? `Edit HumanName ${humanname["@id"]}` : `Create HumanName`}
      </h1>
      <Formik
        initialValues={
          humanname
            ? {
                ...humanname,
              }
            : new HumanName()
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
                router.push("/human_names");
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
                htmlFor="humanname_text"
              >
                text
              </label>
              <input
                name="text"
                id="humanname_text"
                value={values.text ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.text && touched.text ? "border-red-500" : ""
                }`}
                aria-invalid={errors.text && touched.text ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="text"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="humanname_family"
              >
                family
              </label>
              <input
                name="family"
                id="humanname_family"
                value={values.family ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.family && touched.family ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.family && touched.family ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="family"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="humanname_given"
              >
                given
              </label>
              <input
                name="given"
                id="humanname_given"
                value={values.given ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.given && touched.given ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.given && touched.given ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="given"
              />
            </div>
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">
                practitioner
              </div>
              <FieldArray
                name="practitioner"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="humanname_practitioner">
                    {values.practitioner && values.practitioner.length > 0 ? (
                      values.practitioner.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`practitioner.${index}`} />
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
        {humanname && (
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
