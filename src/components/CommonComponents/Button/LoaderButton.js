import { Button, CircularProgress } from '@material-ui/core'
import React from 'react'

const LoaderButton = ({children, isLoading=false, variant='contained', size='medium', color='primary', loadingText='loading', ...props}) => {
  return (
    <Button variant={variant} color={color} size={size} disabled={isLoading} {...props}
        startIcon={isLoading && <CircularProgress size={size === 'small' && 12 || size === 'medium' && 14 || size === 'large' && 20} color={variant === 'contained' ? 'white' : color} />}
    >
        {
            isLoading ? loadingText :
            children
        }
    </Button>
  )
}

export default LoaderButton