import { URL } from "../config/serverUrls"
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
export const getAllWithheldRemarks = () => {
    return new Promise((resolve, reject) => {
        apiCall(`withheld/loans/remarks`)
            .then(({ status, data, message }) => {
                if (status === "SUCCESS") {
                    const result = data.map(item => ({
                        label: item.remarks,
                        value: item.id,
                    }))
                    resolve(result || [])
                } else {
                    reject(message)
                }
            })
            .catch((e) => {
                reject(e.message)
            })
    })
}
export const updateRemarks = (id, remarks) => {
    return new Promise((resolve, reject) => {
        apiCall(`dealership/${id}/withheld/loans`, {
            method: 'POST',
            body: {
                remarks_id: remarks
            }
        })
            .then(({ status, data, message }) => {
                if (status === "SUCCESS") {
                    resolve(message);
                } else {
                    reject(message);
                }
            })
            .catch(e => {
                reject(e.message);
            })
    });
}
export const addNewRemarks = (id, remarks) => {
    return new Promise((resolve, reject) => {
        apiCall(`dealership/${id}/withheld/loans`, {
            method: 'POST',
            body: {
                remarks: remarks
            }
        })
            .then(({ status, data, message }) => {
                if (status === "SUCCESS") {
                    resolve(message);
                } else {
                    reject(message);
                }
            })
            .catch(e => {
                reject(e.message);
            })
    });
}
export const resolveRemarks = (id) => {
    return new Promise((resolve, reject) => {
        apiCall(`withheld/loans/${id}`, {
            method: 'POST',
            body: {
                is_resolved: 1
            }
        })
            .then(({ status, data, message }) => {
                if (status === "SUCCESS") {
                    resolve(message);
                } else {
                    reject(message);
                }
            })
            .catch(e => {
                reject(e.message);
            })
    });
}
export const deleteRemarks = (id) => {
    return new Promise((resolve, reject) => {
        apiCall(`withheld/loans/${id}`, {
            method: 'DELETE',

        })
            .then(({ status, data, message }) => {
                if (status === "SUCCESS") {
                    resolve(message);
                } else {
                    reject(message);
                }
            })
            .catch(e => {
                reject(e.message);
            })
    });
}