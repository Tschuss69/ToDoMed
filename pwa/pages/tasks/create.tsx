import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/task/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Task</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
