import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/coding/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Coding</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
