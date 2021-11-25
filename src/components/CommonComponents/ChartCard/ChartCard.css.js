import styled from 'styled-components'

export const ChartCardContainer = styled.div`
`;

export const ChartCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #353535;
  margin-bottom: 8px;
`;

export const ChartWrapper = styled.div`
  display: flex;
  background-color: #fff;
  border-radius: 6px;
  padding: 8px;
  align-items: center;
  max-height: 300px;
`;

export const ChartBlock = styled.div`
  min-width: ${props => props.verticalLabels ? '70%' : '50%'};
  text-align: center;
`;

export const ChartLabelWrapper = styled.div`
  background-color: #fff;
  color: #353535;
  /* transition: all 0.35s ease-in; */
  position: relative;
  padding: 8px;
  padding-left: 24px;
  display: inline-block;
  min-width: 120px;
  border-radius: 4px;
  margin: 4px;

  &::before {
    /* content: '⬤'; */
    content: '●';
    color: ${props => props.color};
    position: absolute;
    font-size: 20px;
    left: 4px;
  }

  .cc-label {
    &-value {
      font-size: 20px;
      line-height: 24px;
      font-weight: 600;
    }
    &-text {
      font-size: 14px;
      color: ${props => props.color};
    }
  }

  &:hover {
    background-color: ${props => props.color};
    color: #fff;
    cursor: pointer;

    .cc-label-value,
    .cc-label-text {
      color: #fff;
    }
  }
`;

export const ChartLabelsBlock = styled.div`
  /* display: flex; */
  flex-direction: ${props => props.vertical ? 'column' : 'row'};
  /* flex-wrap: wrap;
  justify-content: space-around; */
`;