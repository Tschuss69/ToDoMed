import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Coding } from "../../types/Coding";

interface Props {
  coding?: Coding;
}

interface SaveParams {
  values: Coding;
}

interface DeleteParams {
  id: string;
}

const saveCoding = async ({ values }: SaveParams) =>
  await fetch<Coding>(!values["@id"] ? "/codings" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteCoding = async (id: string) =>
  await fetch<Coding>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ coding }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Coding> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveCoding(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Coding> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteCoding(id), {
    onSuccess: () => {
      router.push("/codings");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!coding || !coding["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: coding["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/codings"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {coding ? `Edit Coding ${coding["@id"]}` : `Create Coding`}
      </h1>
      <Formik
        initialValues={
          coding
            ? {
                ...coding,
              }
            : new Coding()
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
                router.push("/codings");
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
                htmlFor="coding_system"
              >
                system
              </label>
              <input
                name="system"
                id="coding_system"
                value={values.system ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.system && touched.system ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.system && touched.system ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="system"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="coding_version"
              >
                version
              </label>
              <input
                name="version"
                id="coding_version"
                value={values.version ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.version && touched.version ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.version && touched.version ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="version"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="coding_code"
              >
                code
              </label>
              <input
                name="code"
                id="coding_code"
                value={values.code ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.code && touched.code ? "border-red-500" : ""
                }`}
                aria-invalid={errors.code && touched.code ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="code"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="coding_display"
              >
                display
              </label>
              <input
                name="display"
                id="coding_display"
                value={values.display ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.display && touched.display ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.display && touched.display ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="display"
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
        {coding && (
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
