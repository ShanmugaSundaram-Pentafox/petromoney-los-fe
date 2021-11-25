import { AES } from 'crypto-es/lib/aes.js';
import { Utf8 } from 'crypto-es/lib/core';
// import CryptoJS from "crypto-js";
const panRegx = new RegExp(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/)
const gstRegex = new RegExp(/^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/)
const aadharRegx = new RegExp(/^(\d{12})$|^(\d{16})$/)

export const encrypt = text => {
  return text;
  // if(panRegx.test(text) || aadharRegx.test(text)){
  //   try {
  //     const ciphertext = AES.encrypt(text, process.env.REACT_APP_CRYPT_KEY);
  //     // console.log('>> CIPHER TEXT -- ', text, ciphertext.toString());
  //     const result = ciphertext.toString();
  //     return result || text;
  //   } catch(e) {
  //     console.log(e)
  //     return text;
  //   }
  // } else {
  //   return text;
  // }
}

export const decrypt = cipher => {
  if(panRegx.test(cipher) || aadharRegx.test(cipher) || gstRegex.test(cipher)){
    return cipher;
  } else {
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
}

export const cryptoEncrypt = (data) => {
  return data;
  // if(data){
  //   try{
  //     const encrypted = CryptoJS.AES.encrypt(data, process.env.REACT_APP_CRYPT_KEY);
  //     const result = encrypted.toString();
  
  //     return result || data;
  //   } catch(e) {
  //     console.log(e)
  //     return data;
  //   }
  // } else {
  //   return data
  // }
}

export const cryptoDecrypt = (data) => {
  return data;
  // if(data){
  //   try{
  //     const decrypted = CryptoJS.AES.decrypt(data, process.env.REACT_APP_CRYPT_KEY);
  //     const result = decrypted.toString(CryptoJS.enc.Utf8);
  
  //     return result || data;
  //   } catch(e) {
  //     console.log(e)
  //     return data;
  //   }
  // } else {
  //   return data
  // }
}
