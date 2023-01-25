import { URL } from '../config/serverUrls';

const AccessPermission = (currentUser) => {
  /*
    This is common cerbos function which fetches resource from API and returns
    allowed actions for the current resource with filter allAllowed actions and allDenied actions

    isAllowed function return boolean value for the particular action if allowed
    isDenied function return boolean value for the particular action if denied

    usage example:

    useEffect(() => {
      Cerbos('API URL')
      .then(data => {
        isAllowed(DATA, RESOURCE_ID, ACTION_ID) returns BOOLEAN
        isDenied(DATA, RESOURCE_ID, ACTION_ID) returns BOOLEAN
        allAllowed(DATA, RESOURCE_ID) returns LIST of all allowed action in giver particular resource
        allAllowed(DATA) returns LIST of all allowed actions
        allDenied(DATA, RESOURCE_ID) returns LIST of all allowed action in giver particular resource
        allDenied(DATA) returns LIST of all denied actions
      })
      .catch(e => console.log(e))
    }, [])
  */

  return new Promise((resolve, reject) => {
    fetch(`${URL.base}${URL.cerbos}`, {
      headers: new Headers({
        'Authorization': 'Bearer '+ currentUser?.token
      })
    })
      .then((data) => data?.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Check and return boolean based on permission value
export const checkValue = (value) => {
  return value === 'EFFECT_ALLOW'
};

// Check and return Crebos permission string based on boolean input
export const parseValue = (value) => {
  return value ? 'EFFECT_ALLOW' : 'EFFECT_DENY'
};

// Check if action is allowed
// export const isAllowed = (data=[], resource_id, action_id) => {
//   for (const res of data) {
//     const { resource, actions } = res;
//     if(resource?.kind === resource_id) {
//       if(actions.hasOwnProperty(action_id)) {
//         return checkValue(actions[action_id])
//       } else {
//         return false
//       }
//     }
//   }
// };

export const isAllowed = (data=[], resource_id, action_id) => {
  return data[`${resource_id}_${action_id}`] === 'EFFECT_ALLOW';
};

// Filter all Denied actions
export const allDenied = (data, resource_id) => {
  const falseValues = [];
  for (const res of data) {
    const { resource, actions } = res;
    const iteratePermission = () => {
      for (const key in actions) {
        if (!checkValue(actions[key])) {
          falseValues.push(key);
        }
      }
    }
    if (resource_id) {
      if (resource?.kind === resource_id) {
        iteratePermission()
      } 
    }
    else {
      iteratePermission()
    }
  }
  return falseValues;
};

export default AccessPermission;