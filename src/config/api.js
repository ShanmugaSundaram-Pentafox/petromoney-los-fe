import Axios from 'axios';
import { URL } from './serverUrls';

// Axios.defaults.xsrfHeaderName = "X-CSRF-TOKEN"
// Axios.defaults.xsrfCookieName = "csrf_access_token"

export const API = Axios.create({
  baseURL: URL.base,
  // xsrfCookieName: 'csrf_access_token',
  // xsrfHeaderName: 'X-CSRF-TOKEN'
});