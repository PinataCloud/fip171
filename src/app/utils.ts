import * as jose from 'jose';
const PRIVY_APP_ID = 'clwqrzmdf04wers4y8zmfo0yq';

const PRIVY_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----${process.env.PRIVY_VERIFICATION_TOKEN}-----END PUBLIC KEY-----` || ""

export const verifySession = async (token: string) => {
  console.log({token})
  try {
    const verificationKey = await jose.importSPKI(PRIVY_PUBLIC_KEY, 'ES256');    
    const payload = await jose.jwtVerify(token, verificationKey, {
      issuer: 'privy.io',
      audience: PRIVY_APP_ID
    });
    //  Verify that the sub matches app id
    if(payload?.payload?.aud?.includes(PRIVY_APP_ID)) {
      return true;
    } 
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}