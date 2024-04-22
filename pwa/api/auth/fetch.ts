import {fetch} from "@/utils/dataAccess";

export interface LoginParams {
  username: string;
  password: string;
}

interface Token {
  token: string;
}

export const postLogin = async ( values : LoginParams) =>
  await fetch<Token>("/api/login", {
    method: "POST" ,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
