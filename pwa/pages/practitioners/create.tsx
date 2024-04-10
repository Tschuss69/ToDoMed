import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/practitioner/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Practitioner</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
