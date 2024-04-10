import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { ContactPoint } from "../../types/ContactPoint";

interface Props {
  contactpoint?: ContactPoint;
}

interface SaveParams {
  values: ContactPoint;
}

interface DeleteParams {
  id: string;
}

const saveContactPoint = async ({ values }: SaveParams) =>
  await fetch<ContactPoint>(
    !values["@id"] ? "/contact_points" : values["@id"],
    {
      method: !values["@id"] ? "POST" : "PUT",
      body: JSON.stringify(values),
    }
  );

const deleteContactPoint = async (id: string) =>
  await fetch<ContactPoint>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ contactpoint }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<ContactPoint> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveContactPoint(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<ContactPoint> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteContactPoint(id), {
    onSuccess: () => {
      router.push("/contactpoints");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!contactpoint || !contactpoint["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: contactpoint["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/contactpoints"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {contactpoint
          ? `Edit ContactPoint ${contactpoint["@id"]}`
          : `Create ContactPoint`}
      </h1>
      <Formik
        initialValues={
          contactpoint
            ? {
                ...contactpoint,
              }
            : new ContactPoint()
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
                router.push("/contact_points");
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
                htmlFor="contactpoint_system"
              >
                system
              </label>
              <input
                name="system"
                id="contactpoint_system"
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
                htmlFor="contactpoint_value"
              >
                value
              </label>
              <input
                name="value"
                id="contactpoint_value"
                value={values.value ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.value && touched.value ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.value && touched.value ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="value"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="contactpoint_use"
              >
                use
              </label>
              <input
                name="use"
                id="contactpoint_use"
                value={values.use ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.use && touched.use ? "border-red-500" : ""
                }`}
                aria-invalid={errors.use && touched.use ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="use"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="contactpoint_rank"
              >
                rank
              </label>
              <input
                name="rank"
                id="contactpoint_rank"
                value={values.rank ?? ""}
                type="number"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.rank && touched.rank ? "border-red-500" : ""
                }`}
                aria-invalid={errors.rank && touched.rank ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="rank"
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
        {contactpoint && (
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
