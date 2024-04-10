import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/humanname/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create HumanName</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
