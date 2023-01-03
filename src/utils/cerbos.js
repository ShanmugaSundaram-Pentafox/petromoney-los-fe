import { URL } from "../config/serverUrls";

const Cerboss = (currentUser) => {
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
  return value === 'EFFECT_ALLOW' ? true : false;
};

// Check and return Crebos permission string based on boolean input
export const parseValue = (value) => {
  return value === true ? 'EFFECT_ALLOW' : 'EFFECT_DENY';
};

// Check if action is allowed
export const isAllowed = (data=[], resource_id, action_id) => {
  for (const res of data) {
    const { resource, actions } = res;
    if(resource?.kind === resource_id) {
      for (const key in actions) {
        if (key === action_id) {
          return checkValue(actions[key]);
        }
      }
    }
  }
};

// Check if action is denied
export const isDenied = (data, resource_id, action_id) => {
  for (const res of data) {
    const { resource, actions } = res;
    if (resource?.kind === resource_id) {
      for (const key in actions) {
        if (key === action_id) {
          return !checkValue(actions[key]);
        }
      }
    }
  }
};

// Filter all Allowed actions
export const allAllowed = (data, resource_id) => {
  const trueValues = [];
  for (const res of data) {
    const loop = () => {
      for (const key in actions) {
        if (checkValue(actions[key])) {
          trueValues.push(key);
        }
      }
    }
    const { resource, actions } = res;
    if (resource_id) {
      if (resource?.kind === resource_id) {
        loop()
      } 
    }
    else {
      loop()
    }
  }
  return trueValues;
};

// Filter all Denied actions
export const allDenied = (data, resource_id) => {
  const falseValues = [];
  for (const res of data) {
    const { resource, actions } = res;
    const loop = () => {
      for (const key in actions) {
        if (!checkValue(actions[key])) {
          falseValues.push(key);
        }
      }
    }
    if (resource_id) {
      if (resource?.kind === resource_id) {
        loop()
      } 
    }
    else {
      loop()
    }
  }
  return falseValues;
};

export default Cerboss;