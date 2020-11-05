import { API } from "../config/api"
import { URL } from "../config/serverUrls"
import { store } from "../store"

export const getAllTransport = () => {
  const currentUser = store.getState().user.currentUser
  console.log(currentUser.token)
  return new Promise((resolve, reject) => {
    API.get(URL.transport, {
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    })
      .then(({ data }) => {
        if (data.status === "SUCCESS") {
          resolve(data.data)
        } else {
          reject(data.message)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
}
