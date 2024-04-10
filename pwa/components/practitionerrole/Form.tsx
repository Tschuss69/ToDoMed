import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { PractitionerRole } from "../../types/PractitionerRole";

interface Props {
  practitionerrole?: PractitionerRole;
}

interface SaveParams {
  values: PractitionerRole;
}

interface DeleteParams {
  id: string;
}

const savePractitionerRole = async ({ values }: SaveParams) =>
  await fetch<PractitionerRole>(
    !values["@id"] ? "/practitioner_roles" : values["@id"],
    {
      method: !values["@id"] ? "POST" : "PUT",
      body: JSON.stringify(values),
    }
  );

const deletePractitionerRole = async (id: string) =>
  await fetch<PractitionerRole>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ practitionerrole }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<PractitionerRole> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => savePractitionerRole(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<PractitionerRole> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deletePractitionerRole(id), {
    onSuccess: () => {
      router.push("/practitionerroles");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!practitionerrole || !practitionerrole["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: practitionerrole["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/practitionerroles"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {practitionerrole
          ? `Edit PractitionerRole ${practitionerrole["@id"]}`
          : `Create PractitionerRole`}
      </h1>
      <Formik
        initialValues={
          practitionerrole
            ? {
                ...practitionerrole,
              }
            : new PractitionerRole()
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
                router.push("/practitioner_roles");
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
                practitioner
              </div>
              <FieldArray
                name="practitioner"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="practitionerrole_practitioner">
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
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="practitionerrole_codeCode"
              >
                codeCode
              </label>
              <input
                name="codeCode"
                id="practitionerrole_codeCode"
                value={values.codeCode ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.codeCode && touched.codeCode ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.codeCode && touched.codeCode ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="codeCode"
              />
            </div>
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">
                requestedTasks
              </div>
              <FieldArray
                name="requestedTasks"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="practitionerrole_requestedTasks">
                    {values.requestedTasks &&
                    values.requestedTasks.length > 0 ? (
                      values.requestedTasks.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`requestedTasks.${index}`} />
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
                performingTasks
              </div>
              <FieldArray
                name="performingTasks"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="practitionerrole_performingTasks">
                    {values.performingTasks &&
                    values.performingTasks.length > 0 ? (
                      values.performingTasks.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`performingTasks.${index}`} />
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
        {practitionerrole && (
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
