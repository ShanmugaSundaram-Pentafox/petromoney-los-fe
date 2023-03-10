import isEmpty from 'lodash-es/isEmpty';
import { logger } from '../config/logger';
import { URL } from '../config/serverUrls';
import { store } from '../store';
import { resetCurrentUser } from '../store/user/user.actions';
import { selectCurrentUser } from '../store/user/user.selector';

const timeoutDuration = 60000;
const apiServer = URL.base;
let isJustLoggedOut = false;

const apiCall = async (route, options = {}) => {
  const {
    body = {},
    method = 'GET',
    customDomain = false,
    customToken = null,
    customHeader = {}
  } = options;
  const credentials = await selectCurrentUser(store.getState());


  // avoided content-type in header of GET Method to get the clear error log from BE.
  let headerObject = method == 'GET' ? {
    'Access-Control-Allow-Credentials': 'no-cors'
  } : {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'no-cors'
  };

  if (customHeader && !isEmpty(customHeader)) {
    headerObject = {
      ...headerObject,
      ...customHeader
    };
  }

  if (customToken) {
    headerObject.Authorization = 'Bearer ' + customToken;
  } else if (credentials && credentials.id && credentials.token) {
    headerObject.Authorization = 'Bearer ' + credentials.token;
  }

  // eslint-disable-next-line no-undef
  const headers = new Headers(headerObject);

  const requestDetails = {
    method,
    mode: 'cors',
    headers,
    credentials: 'include',
  };

  if (method !== 'GET') {
    requestDetails.body = JSON.stringify(body);
  }

  const serverURL = customDomain ? customDomain : apiServer;

  const requestURL = `${serverURL}${route}`;

  /**
   * Start Performance monitoring for the current request
   */
  /*
  const metric = perf().newHttpMetric(requestURL, method);
  await metric.start();
  if (!_.isEmpty(body)) {
    for (let key in body) {
      if (body.hasOwnProperty(key)) {
        await metric.putAttribute(key, JSON.stringify(body[key]));
      }
    }
  }
  */
  /**
   * This promise will start the network request and will return the data from the server
   * or throw errors in case the network request fails
   */
  const request = new Promise((resolve, reject) => {
    console.log(requestURL);
    // console.log(body);
    // console.log(JSON.stringify(body));
    // console.log(method);
    // console.log(headers);

    async function handleResponse(response) {
      /**
       * Tracking the response performance
       */
      /*
      metric
        .setHttpResponseCode(response.status)
        .then(() => {
          metric.setResponseContentType(response.headers.get("Content-Type"));
        })
        .then(() => {
          // metric
          //   .setResponsePayloadSize(response.headers.get("Content-Length"))
          //   .then(() => {
          metric.stop();
          //  });
        });
      */

      // console.log(response.status);
      // console.log(response.statusText);

      /**
       * User session has expired and he must be forced to logout
       */
      if (
        response.status === 401 &&
        credentials &&
        credentials.id &&
        credentials.token
      ) {
        if (!isJustLoggedOut) {
          isJustLoggedOut = true;

          // DebouncedAlert("Oops!", "Session Expired... Please Login again!");
          alert('Oops! Session Expired... Please Login again!');
        }
        // logOut();
        store.dispatch(resetCurrentUser({ timeout: true }));

        return { status: 'EXPIRED' };
      } else {
        isJustLoggedOut = false;
        /**
         * Request success will return the data
         */
        if (response.status === 200) {
          const data = response.json();
          return data;
        } else if (response.status === 204) {
          /**
           * Request success but no data returned from the server
           */
          const data = { status: 'SUCCESS' };
          return data;
        } else {
          /**
           * Request failed. This will throw an error object to fail the fetch promise
           */
          const errorInfo = {
            type: 'apiCall',
            url: requestURL,
            body,
            status: response.status,
            ...headerObject
          };
          const data = await response.json();
          const errorObject = Error(
            JSON.stringify({
              ...data,
              status: response.status,
              url: requestURL,
            })
          );
          logger(errorObject, errorInfo)
          // logError(errorObject, errorInfo);
          throw errorObject;
        }
      }
    }

    fetch(requestURL, requestDetails)
      .then(handleResponse) // will return the data or handles any errors in the network request
      .then(data => {
        // console.log(data);
        // console.log(JSON.stringify(data));
        /**
         * // LOG TO SENTRY
         
         logBreadCrumb({
           message: requestURL,
           category: constants.errorLoggerEvents.categories.networkRequest,
           data: {
             requestURL,
             requestBody: JSON.stringify(requestDetails.body),
             ...headerObject,
             response: JSON.stringify(data)
           },
           level: constants.errorLoggerEvents.levels.info
         });

         */
        resolve(data);
      })
      .catch(err => {
        console.log('fetch Error >> ', err);
        reject(err);
      });
  });

  /**
   * Will execute a reject action after the `timeoutDuration`
   * If it executes this will mark the network request as timed out
   */
  const networkTimeOut = reject => {
    return setTimeout(() => {
      const errorInfo = {
        type: 'apiCall',
        url: requestURL,
        body,
        ...headerObject
      };
      const errorObject = Error(
        JSON.stringify({
          status: 'Request timed out!',
          url: requestURL
        })
      );
      logger(errorObject, errorInfo);
      // logError(errorObject, errorInfo);
      reject(errorObject);
    }, timeoutDuration);
  };

  /**
   * Starts both the timeout and the network request
   * and resolves whichever executes first.
   */
  return new Promise((resolve, reject) => {
    const timeoutId = networkTimeOut(reject);
    request
      .then(result => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
};

export default apiCall;
