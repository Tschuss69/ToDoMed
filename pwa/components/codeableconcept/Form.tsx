import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { CodeableConcept } from "../../types/CodeableConcept";

interface Props {
  codeableconcept?: CodeableConcept;
}

interface SaveParams {
  values: CodeableConcept;
}

interface DeleteParams {
  id: string;
}

const saveCodeableConcept = async ({ values }: SaveParams) =>
  await fetch<CodeableConcept>(
    !values["@id"] ? "/codeable_concepts" : values["@id"],
    {
      method: !values["@id"] ? "POST" : "PUT",
      body: JSON.stringify(values),
    }
  );

const deleteCodeableConcept = async (id: string) =>
  await fetch<CodeableConcept>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ codeableconcept }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<CodeableConcept> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveCodeableConcept(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<CodeableConcept> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteCodeableConcept(id), {
    onSuccess: () => {
      router.push("/codeableconcepts");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!codeableconcept || !codeableconcept["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: codeableconcept["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/codeableconcepts"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {codeableconcept
          ? `Edit CodeableConcept ${codeableconcept["@id"]}`
          : `Create CodeableConcept`}
      </h1>
      <Formik
        initialValues={
          codeableconcept
            ? {
                ...codeableconcept,
              }
            : new CodeableConcept()
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
                router.push("/codeable_concepts");
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
              <div className="text-gray-700 block text-sm font-bold">
                coding
              </div>
              <FieldArray
                name="coding"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="codeableconcept_coding">
                    {values.coding && values.coding.length > 0 ? (
                      values.coding.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`coding.${index}`} />
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
                htmlFor="codeableconcept_text"
              >
                text
              </label>
              <input
                name="text"
                id="codeableconcept_text"
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
        {codeableconcept && (
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
