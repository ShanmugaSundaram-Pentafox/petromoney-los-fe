import React from 'react';
import styled from 'styled-components';

const StatsCardWrapper = styled.div`
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  /* box-shadow:  20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff; */
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048);
  color: #343434;
  min-width: 190px;

  .stat-number-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    .stat-number {
      font-size: 24px;
      font-weight: 600;
    }

    .stat-icon {

    }
  }

  .stat-desc {
    font-size: 14px;
  }
`;

const StatsCard = ({
  classes,
  value,
  text,
  icon,
  action = ()=>null
}) => {
  return (
    <StatsCardWrapper className={classes} onClick={action}>
      <div className="stat-number-block">
        <div className="stat-number">
          {value || '-'}
        </div>
        <div className="stat-icon">
          {icon}
        </div>
      </div>
      <div className="stat-desc">{text || ''}</div>
    </StatsCardWrapper>
  )
}

export default StatsCard;