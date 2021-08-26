import { URL } from "../config/serverUrls"
import { getDealershipLoansById } from "./dealerships.service";
import apiCall from "../utils/api.util";

export const getAllWithheldLoans = () => {
    return new Promise((resolve, reject) => {
        apiCall(`withheld/loans`)
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