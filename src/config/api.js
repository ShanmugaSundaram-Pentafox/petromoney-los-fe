import Axios from 'axios';
import { URL } from './serverUrls';

export const API = Axios.create({
  baseURL: URL.base
});