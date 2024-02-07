import React from 'react';

const EnvTag = () => {
  if(process.env.REACT_APP_ENV === 'production') return null;
  
  return (
    <span className="fixed top-0 left-0 bg-gradient-to-r from-red-500 to-orange-500 text-2xl tracking-tighter uppercase text-white font-bold pt-2 pl-4 pr-8 pb-4 rounded-br-full shadow-md pointer-events-none z-[99999]">
      UAT
    </span>
  )
}

export default EnvTag;