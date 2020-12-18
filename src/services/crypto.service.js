import { AES } from "crypto-es/lib/aes.js";
import { Utf8 } from "crypto-es/lib/core";

export const encrypt = text => {
  try {
    const ciphertext = AES.encrypt(text, process.env.REACT_APP_CRYPT_KEY);
    // console.log('>> CIPHER TEXT -- ', text, ciphertext.toString());
    const result = ciphertext.toString();
    return result || text;
  } catch(e) {
    console.log(e)
    return text;
  }
}

export const decrypt = cipher => {
  try {
    const bytes = AES.decrypt(cipher.toString(), process.env.REACT_APP_CRYPT_KEY);
    const result = bytes.toString(Utf8);
    // console.log(cipher.toString(), process.env.REACT_APP_CRYPT_KEY, result)
    // console.log('>> DECIPHER -- ', cipher, result);
    // return text;
    return result || cipher;
  } catch(e) {
    
    console.log(cipher, e)
    return cipher;
  }
}
