import { NextApiRequest, NextApiResponse } from 'next'
import {postLogin} from "@/api/auth/fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    console.log('req')
    console.log(req)

    await postLogin(req.body).then((response) => {
      console.log(response)
      const token = response.data.token;
      props.createSession(token);

    })
      .catch(err => {
        console.log(err);
      });

    res.status(200).json({ success: true })
  } catch (error) {
    if (error.type === 'CredentialsSignin') {
      res.status(401).json({ error: 'Invalid credentials.' })
    } else {
      res.status(500).json({ error: 'Something went wrong.' })
    }
  }
}
