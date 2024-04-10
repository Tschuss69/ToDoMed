import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/codeableconcept/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create CodeableConcept</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
