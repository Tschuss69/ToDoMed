import {jwtDecode} from "jwt-decode";
import {cookies} from "next/headers";
import {jwtVerify, SignJWT} from "jose";

const secretKey = 'secret';
const key = new TextEncoder().encode(secretKey);

function decodeToken(token: string){
  try {
    const decoded = jwtDecode(token);
    console.log("decoded")
    console.log(decoded)
    return decoded.roles; // Supposons que les rôles sont stockés dans une propriété `roles`
  } catch (error) {
    console.error("Failed to decode the JWT:", error);
    return null;
  }
}

async function encrypt(payload: any, expires){
  return await new SignJWT(payload)
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(key);
}

async function decrypt(input: string): Promise<any>{
  const {payload} = await jwtVerify(input, key, {algorithms: ['HS256']});
  return payload;
}



export async function createSession(token){
  const decriptedToken = await decodeToken(token);
  const expires = decriptedToken.exp;
  const session = await encrypt(decriptedToken, expires);

  cookies(). set( 'session', session, { expires, httpOnly: true });
}
