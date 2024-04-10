import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/encounter/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Encounter</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
