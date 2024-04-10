import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/codeableconceptcategory/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create CodeableConceptCategory</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
