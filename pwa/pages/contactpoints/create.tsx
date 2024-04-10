import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/contactpoint/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create ContactPoint</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
