import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

const ActivityBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: .8rem 0;
  position: relative;

  *, ::after, ::before {
    box-sizing: border-box;
  }

  &:before,
  &:after {
    display: block;
    background-color: #c0cadd;
    position: absolute;
    content: "";
  }

  &:first-child:before {
    top: 50%;
  }

  &:last-child:before {
    bottom: 50%;
  }

  &:before {
    width: 3px;
    top: 0;
    bottom: 0;
    left: 75px;
  }

  &:after {
    width: 20px;
    top: 50%;
    height: 1px;
    left: 80px;
    z-index: 1;
  }

  .activity-time {
    flex: 0 0 100px;
    font-size: .63rem;
    text-transform: uppercase;
    color: rgba(0,0,0,.4);
    text-align: right;
    padding-right: 40px;
  }

  .activity-box {
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(126,142,177,.12);

    padding: .8rem;
    display: flex;
    flex: 1;
    position: relative;
    align-items: center;

    max-width: 260px;

    &:before {
      position: absolute;
      top: 50%;
      left: -31px;
      content: "";
      width: 12px;
      height: 12px;
      border: 2px solid #60769f;
      background-color: #f2f4f8;
      border-radius: 20px;
      transform: translateY(-50%);
      z-index: 2;
    }

    .activity-info {
      flex: 1;

      .activity-role {
        /* font-size: .63rem; */
        /* text-transform: uppercase; */
        color: rgba(0,0,0,.4);
        margin-bottom: .2rem;
        text-transform: none;
        font-size: 11.5px;
      }

      .activity-title {
        font-weight: 400;
        font-size: .63rem;
        text-transform: uppercase;
        display: block;
      }
    }
  }
`;


const ActivityBox = ({ dateCreated, username, activity }) => {
  return (
    <ActivityBoxWrapper>
      <div className="activity-time">{moment(dateCreated).format('DD/MM/YYYY HH:MM A')}</div>
      <div className="activity-box">
        <div className="activity-info">
          <div className="activity-role">{username}</div>
          <strong className="activity-title">{activity}</strong>
        </div>
      </div>
    </ActivityBoxWrapper>
  )
}

export default ActivityBox;