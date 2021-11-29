import React from 'react';
import styled from 'styled-components'

const EnvCard = styled.div`
  position: fixed;
  z-index: 3000;
  top: 0;
  left: calc(6% - 10px);
  width: 120px;
  background-color: #99201c;
  background-image: linear-gradient(316deg, #99201c 0%, #f56545 74%);
  border-bottom-left-radius: 55px;
  border-bottom-right-radius: 55px;
  box-shadow: 0 3px 5px -3px #000;
  padding: 10px;
  text-align: center;
  
  strong {
    font-size: 22px;
    color: #fff;
    text-shadow: 0 0 4px #333;
    padding-bottom: 4px;
    display: block;
  }
`;

const EnvTag = () => {
  if(process.env.REACT_APP_ENV === 'production') return null;
  return (
    <EnvCard>
      <strong>UAT</strong>
    </EnvCard>
  )
}

export default EnvTag;