import React, { useState } from 'react';
import { useMount } from 'react-use';
import styled from 'styled-components';

const DocContainer = styled.div`

`;

const DocListContainer = styled.div`

`;

const ListTitle = styled.h4`

`;

const DealersDoc = () => {
  const [dealersDocs, setDealersDocs] = useState();
  useMount(() => {

  });

  return (
    <DocListContainer>

    </DocListContainer>
  )
}

const DealershipDoc = () => {
  const [dealershipDocs, setDealershipDocs] = useState();
  useMount(() => {

  });

  return (
    <DocListContainer>

    </DocListContainer>
  )
}

const DocList = () => {
  return (
    <DocContainer>
      <ListTitle>Dealership Documents</ListTitle>
      <DealershipDoc />
      <ListTitle>Dealers Documents</ListTitle>
      <DealersDoc />
    </DocContainer>
  )
}

export default DocList;