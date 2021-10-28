import { AES } from "crypto-es/lib/aes.js";
import { Utf8 } from "crypto-es/lib/core";
import CryptoJS from "crypto-js";

export const encrypt = text => {
  return text;
  // try {
  //   const ciphertext = AES.encrypt(text, process.env.REACT_APP_CRYPT_KEY);
  //   // console.log('>> CIPHER TEXT -- ', text, ciphertext.toString());
  //   const result = ciphertext.toString();
  //   return result || text;
  // } catch(e) {
  //   console.log(e)
  //   return text;
  // }
}

export const decrypt = cipher => {
  try {
    const bytes = AES.decrypt(cipher.toString(), process.env.REACT_APP_CRYPT_KEY);
    let result = bytes.toString(Utf8);
    if (!result) {
      const b = AES.decrypt(cipher.toString(), 'uat-salt-key');
      result = b.toString(Utf8);
    }
    // console.log(cipher.toString(), process.env.REACT_APP_CRYPT_KEY, result)
    // console.log('>> DECIPHER -- ', cipher, result);
    // return text;
    return result || cipher;
  } catch(e) {
    
    // console.log(cipher, e)
    return cipher;
  }
}

export const cryptoEncrypt = (data) => {
  try{
    const encrypted = CryptoJS.AES.encrypt(data, process.env.REACT_APP_CRYPT_KEY_NEW);
    const result = encrypted.toString();

    return result || data;
  } catch(e) {
    console.log(e)
    return data;
  }
}

export const cryptoDecrypt = (data) => {
  try{
    const decrypted = CryptoJS.AES.decrypt(data, process.env.REACT_APP_CRYPT_KEY_NEW);
    const result = decrypted.toString(CryptoJS.enc.Utf8);

    return result || data;
  } catch(e) {
    console.log(e)
    return data;
  }
}
