import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { CodeableConceptCategory } from "../../types/CodeableConceptCategory";

interface Props {
  codeableconceptcategory?: CodeableConceptCategory;
}

interface SaveParams {
  values: CodeableConceptCategory;
}

interface DeleteParams {
  id: string;
}

const saveCodeableConceptCategory = async ({ values }: SaveParams) =>
  await fetch<CodeableConceptCategory>(
    !values["@id"] ? "/codeable_concept_categories" : values["@id"],
    {
      method: !values["@id"] ? "POST" : "PUT",
      body: JSON.stringify(values),
    }
  );

const deleteCodeableConceptCategory = async (id: string) =>
  await fetch<CodeableConceptCategory>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ codeableconceptcategory }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<CodeableConceptCategory> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveCodeableConceptCategory(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<CodeableConceptCategory> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteCodeableConceptCategory(id), {
    onSuccess: () => {
      router.push("/codeableconceptcategorys");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!codeableconceptcategory || !codeableconceptcategory["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: codeableconceptcategory["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/codeableconceptcategorys"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {codeableconceptcategory
          ? `Edit CodeableConceptCategory ${codeableconceptcategory["@id"]}`
          : `Create CodeableConceptCategory`}
      </h1>
      <Formik
        initialValues={
          codeableconceptcategory
            ? {
                ...codeableconceptcategory,
              }
            : new CodeableConceptCategory()
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
                router.push("/codeable_concept_categories");
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
                htmlFor="codeableconceptcategory_category"
              >
                category
              </label>
              <input
                name="category"
                id="codeableconceptcategory_category"
                value={values.category ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.category && touched.category ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.category && touched.category ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="category"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="codeableconceptcategory_categoryHash"
              >
                categoryHash
              </label>
              <input
                name="categoryHash"
                id="codeableconceptcategory_categoryHash"
                value={values.categoryHash ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`mt-1 block w-full ${
                  errors.categoryHash && touched.categoryHash
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.categoryHash && touched.categoryHash
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="categoryHash"
              />
            </div>
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">
                categorycodeableconcept
              </div>
              <FieldArray
                name="categorycodeableconcept"
                render={(arrayHelpers) => (
                  <div
                    className="mb-2"
                    id="codeableconceptcategory_categorycodeableconcept"
                  >
                    {values.categorycodeableconcept &&
                    values.categorycodeableconcept.length > 0 ? (
                      values.categorycodeableconcept.map(
                        (item: any, index: number) => (
                          <div key={index}>
                            <Field name={`categorycodeableconcept.${index}`} />
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
              <div className="text-gray-700 block text-sm font-bold">
                parent
              </div>
              <FieldArray
                name="parent"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="codeableconceptcategory_parent">
                    {values.parent && values.parent.length > 0 ? (
                      values.parent.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`parent.${index}`} />
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
                codeableconcepts
              </div>
              <FieldArray
                name="codeableconcepts"
                render={(arrayHelpers) => (
                  <div
                    className="mb-2"
                    id="codeableconceptcategory_codeableconcepts"
                  >
                    {values.codeableconcepts &&
                    values.codeableconcepts.length > 0 ? (
                      values.codeableconcepts.map(
                        (item: any, index: number) => (
                          <div key={index}>
                            <Field name={`codeableconcepts.${index}`} />
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
              <div className="text-gray-700 block text-sm font-bold">
                codeableConcepts
              </div>
              <FieldArray
                name="codeableConcepts"
                render={(arrayHelpers) => (
                  <div
                    className="mb-2"
                    id="codeableconceptcategory_codeableConcepts"
                  >
                    {values.codeableConcepts &&
                    values.codeableConcepts.length > 0 ? (
                      values.codeableConcepts.map(
                        (item: any, index: number) => (
                          <div key={index}>
                            <Field name={`codeableConcepts.${index}`} />
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
              <div className="text-gray-700 block text-sm font-bold">
                categoryCodeableConcept
              </div>
              <FieldArray
                name="categoryCodeableConcept"
                render={(arrayHelpers) => (
                  <div
                    className="mb-2"
                    id="codeableconceptcategory_categoryCodeableConcept"
                  >
                    {values.categoryCodeableConcept &&
                    values.categoryCodeableConcept.length > 0 ? (
                      values.categoryCodeableConcept.map(
                        (item: any, index: number) => (
                          <div key={index}>
                            <Field name={`categoryCodeableConcept.${index}`} />
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
        {codeableconceptcategory && (
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
