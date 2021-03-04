import React from 'react';
import styled from 'styled-components';

const DashCardWrapper = styled.div`
  // background-color: yellow; 
  /* padding: 16px; */
  border-radius: 4px;
  /* box-shadow:  20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff; */
  /* box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048); */
  color: #343434;
  .root {
    color:#3f51b5;
  }
  :hover {
    color:#3f51b5;
    border-bottom : 1px solid #3f51b5;
  }
  /* width: 100%; */
  flex: 1;
  min-width: 140px;
  text-align: center;
  border-right: ${props => props.noBorder ? 'none' : '1px dashed #ccc'};
  .stat-number-block {
    display: flex;
    padding: 16px;
    padding-bottom: 0;
    justify-content: space-between;
    /* margin-bottom: 8px; */

    .stat-number {
      font-size: 40px;
      font-weight: 600;
      flex: 1;
    }
    
    .stat-icon {

    }
  }

  .stat-desc {
    font-size: 14px;
    padding: 8px 16px;
    padding-bottom: 0;
    /* padding-top: 16; */
  }
`;

const DashCard = ({
  classes,
  styles,
  value,
  cardName,
  text,
  icon,
  noBorder,
  action = () => null
}) => {
  return (
    <DashCardWrapper noBorder={noBorder} style={styles} onClick={action}>
      <div  className={cardName === text ? 'root' : ' '}>
        <div className="stat-number-block">
          <div className="stat-number">
            {value || '-'}
          </div>
          {/* <div className="stat-icon">
          {icon}
        </div> */}
        </div>
        <div className="stat-desc">{text || ''}</div>
      </div>
    </DashCardWrapper>


  )
}

export default DashCard;