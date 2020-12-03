import styled, { css } from "styled-components"

export const Description = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1fr 1fr;
`
export const Header=styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 0;

  button {
    padding: 8px 16px 8px 16px;
    color: rgba(72,131,219,1);
    border:1px solid #4883DB;
    border-radius: 4px;
  }

`

export const DesChild = styled.div`
  margin: 1rem 1rem;
`
export const DesElement = styled.div`
display:flex;
`

export const Section = styled.div`
  width: 12px;
  height: 12px;
  padding: 5px 5px;
  margin: 4px 1rem;
  border-radius: 50%;
  ${(props) =>
    props.label === 'completed' &&
    css`
      background-color: #93bb88;
    `}
  ${(props) =>
    props.label === 'processing' &&
    css`
      background-color: #f8d58a;
    `}

    ${(props) =>
    props.label === 'rejected' &&
    css`
      background-color: #ff7777;
    `}
    ${(props) =>
    props.label === 'assigned' &&
    css`
      background-color: rgb(25,219,219);
    `}
`

export const Assigned = styled.div`
  display: flex;
  color: #fff;
  background-color: #639b53;
  justify-content: flex-end;
  
`