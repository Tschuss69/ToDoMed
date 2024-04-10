import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Task } from "../../types/Task";

interface Props {
  task?: Task;
}

interface SaveParams {
  values: Task;
}

interface DeleteParams {
  id: string;
}

const saveTask = async ({ values }: SaveParams) =>
  await fetch<Task>(!values["@id"] ? "/tasks" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteTask = async (id: string) =>
  await fetch<Task>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ task }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Task> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveTask(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Task> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteTask(id), {
    onSuccess: () => {
      router.push("/tasks");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!task || !task["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: task["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/tasks"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {task ? `Edit Task ${task["@id"]}` : `Create Task`}
      </h1>
      <Formik
        initialValues={
          task
            ? {
                ...task,
              }
            : new Task()
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
                router.push("/tasks");
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
                htmlFor="task_status"
              >
                status
              </label>
              <input
                name="status"
                id="task_status"
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
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="task_priority"
              >
                priority
              </label>
              <input
                name="priority"
                id="task_priority"
                value={values.priority ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.priority && touched.priority ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.priority && touched.priority ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="priority"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="task_description"
              >
                description
              </label>
              <input
                name="description"
                id="task_description"
                value={values.description ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.description && touched.description
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.description && touched.description ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="description"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="task_authoredOn"
              >
                authoredOn
              </label>
              <input
                name="authoredOn"
                id="task_authoredOn"
                value={values.authoredOn?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.authoredOn && touched.authoredOn
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.authoredOn && touched.authoredOn ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="authoredOn"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="task_lastModified"
              >
                lastModified
              </label>
              <input
                name="lastModified"
                id="task_lastModified"
                value={values.lastModified?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.lastModified && touched.lastModified
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.lastModified && touched.lastModified
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="lastModified"
              />
            </div>
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">
                requesterPractitionerRole
              </div>
              <FieldArray
                name="requesterPractitionerRole"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="task_requesterPractitionerRole">
                    {values.requesterPractitionerRole &&
                    values.requesterPractitionerRole.length > 0 ? (
                      values.requesterPractitionerRole.map(
                        (item: any, index: number) => (
                          <div key={index}>
                            <Field
                              name={`requesterPractitionerRole.${index}`}
                            />
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
                requestedPerformers
              </div>
              <FieldArray
                name="requestedPerformers"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="task_requestedPerformers">
                    {values.requestedPerformers &&
                    values.requestedPerformers.length > 0 ? (
                      values.requestedPerformers.map(
                        (item: any, index: number) => (
                          <div key={index}>
                            <Field name={`requestedPerformers.${index}`} />
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
        {task && (
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
