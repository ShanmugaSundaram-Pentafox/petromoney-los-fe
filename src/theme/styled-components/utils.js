import styled from 'styled-components';

export const InfoBoxStyle = styled.div`
  padding: ${props => `${props.padding || 32}px`};
  background-color: ${props => props.backgroundColor || '#FFFFFF'};
  border-radius: 4px;
  box-shadow: 0px 10px 24px rgba(91, 127, 220, 0.16);
  margin-bottom: ${props => `${props.marginBottom || 24}px`};

  p {
    color: #444444;
    font-size: 16px;
    line-height: 140%;
    margin-bottom: 0px;
  }   

  .title {
    color: #222444;
    font-size: 18px;
    font-weight: 500;
    line-height: 26px;
    margin-bottom: ${props => `${props.titleMarginBottom || 24}px`};
  }
`;

export const ViewMoreBtn = styled.div`
  position: absolute;
  bottom: 5px;
  width: 100%;
  text-align: center;
  padding: 5px;
  padding-top: 15px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(176,176,176,0.75) 100%);
  transition: all .35s ease-in-out;

  &:hover {
    background: linear-gradient(180deg, rgba(255,255,255,0.50) 0%, rgba(176,176,176,0.90) 100%);
  }
`;