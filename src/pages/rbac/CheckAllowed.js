import React from 'react'
import { isAllowed } from '../../utils/cerbos'

const CheckAllowed = ({ currentUser, children, resource, action }) => {
  return (
    isAllowed(currentUser?.permissions, resource, action) &&
    <>
      {children}
    </>
  )
}

export default CheckAllowed