import React from 'react';
import { ConvertCurrencyWithUnit } from '../../Number/Currency';


const DashCard = ({
  value,
  selected,
  text,
  amount,
  action
}) => {
  const isSelected = selected && action

  return (
    <div 
      className={`relative flex flex-col py-5 transition-colors
        ${action ? `cursor-pointer ${isSelected ? ' bg-gray-700' : ' bg-gray-100 hover:bg-gray-200'}` : ' bg-gray-100'} 
      `}
      onClick={action}
      onKeyDown={action}
    >
      <dt 
        className={`px-3 text-xs uppercase font-semibold leading-6 whitespace-nowrap
          ${isSelected ? 'text-white' : 'text-gray-500'}
        `}
      >
        {text}
      </dt>
      
      <dd 
        className={`order-first text-2xl font-semibold tracking-tight
          ${isSelected ? 'text-white' : 'text-gray-900'}
        `}
      >
        {value}
      </dd>

      {amount > 0 ? (
        <dd 
          className={`text-xs font-semibold
            ${isSelected ? 'text-white' : 'text-indigo-600'}
          `}
        >
          <ConvertCurrencyWithUnit amount={amount} />
        </dd>
      ) : null}
    </div>
  )
}

export default DashCard;