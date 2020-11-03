import React, { useEffect } from "react"
import { getAllTransport } from "../../../services/transports.service"

function TransportTable() {
  useEffect(() => {
    getAllTransport().then((d) => {
      console.log(d)
    })
  }, [])

  return <h1>Transport Table</h1>
}

export default TransportTable
