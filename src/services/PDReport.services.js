import { URL } from "../config/serverUrls"
import { getDealershipLoansById } from "./dealerships.service";
import apiCall from "../utils/api.util";

export const getAssetDetails = ({ id }) => {
    return new Promise((resolve, reject) => {
        apiCall(`asset_details/${id}`)
            .then(({ status, data, message }) => {
                if (status === "SUCCESS") {
                    resolve(data)
                } else {
                    reject(message)
                }
            })
            .catch((e) => {
                reject(e.message)
            })
    })
}
export const getOutletDetails = ({ id }) => {
    return new Promise((resolve, reject) => {
        apiCall(`outlet_details/${id}`)
            .then(({ status, data, message }) => {
                if (status === "SUCCESS") {
                    resolve(data)
                } else {
                    reject(message)
                }
            })
            .catch((e) => {
                reject(e.message)
            })
    })
}
export const getOMCDetails = ({ id }) => {
    return new Promise((resolve, reject) => {
        apiCall(`omc_details/${id}`)
            .then(({ status, data, message }) => {
                if (status === "SUCCESS") {
                    resolve(data)
                } else {
                    reject(message)
                }
            })
            .catch((e) => {
                reject(e.message)
            })
    })
}
export const getInfrastructureDetails = ({ id }) => {
    return new Promise((resolve, reject) => {
        apiCall(`infrastructure_details/${id}`)
            .then(({ status, data, message }) => {
                if (status === "SUCCESS") {
                    resolve(data)
                } else {
                    reject(message)
                }
            })
            .catch((e) => {
                reject(e.message)
            })
    })
}