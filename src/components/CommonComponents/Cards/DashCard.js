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
        ${action ? `cursor-pointer ${isSelected ? ' bg-[#339AF0]' : ' bg-[#E7F5FF]/50 hover:bg-[#E7F5FF]'}` : ' bg-[#E7F5FF]/50'} 
      `}
      onClick={action}
      onKeyDown={action}
    >
      <dt
        className={`text-xs uppercase font-semibold leading-6 whitespace-nowrap text-center
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
            ${isSelected ? 'text-white' : 'text-[#228BE6]'}
          `}
        >
          <ConvertCurrencyWithUnit amount={amount} />
        </dd>
      ) : null}
    </div>
  )
}

export default DashCard;