import Axios from 'axios';
import { URL } from './serverUrls';

Axios.defaults.xsrfHeaderName = 'X-CSRF-TOKEN'
Axios.defaults.xsrfCookieName = 'access_token_cookie'

export const API = Axios.create({
  baseURL: URL.base,
  xsrfCookieName: 'access_token_cookie',
  xsrfHeaderName: 'X-CSRF-TOKEN',
  'Access-Control-Allow-Origin': '*',
});