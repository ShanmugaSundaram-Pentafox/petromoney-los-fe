import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { InfoBoxStyle } from '../../../theme/styled-components/utils';

export const EnquiryInfoCardWrapper = styled(InfoBoxStyle)`
    padding: 32px 12px 0px 24px;
    margin-bottom: 16px;
    ul {
        display: flex;
        flex-wrap: wrap;
        padding-left: 0px;
        list-style: none;
        margin: 0;

        li {
            color: #909191;
            width: 50%;
            padding-right: 6px;
            font-size: 16px;
            line-height: 23px;
            margin-bottom: 32px;

            span {
                display: block;
                color: #222444;
                font-size: 18px;
                line-height: 26px;
                margin-top: 6px;
            }
        }
    }
`;

const EnquiryInfoCard = ({
  title='',
  listData= []
}) => {
  return (
    <EnquiryInfoCardWrapper>
      {title ? <p className="title">{title}</p> : null}

      <ul>
        {listData.map((item, i) => {
          return (
            <li key={i}>
              {item.title}
              <span>{item.description}</span>
            </li>
          )
        })}
      </ul>
    </EnquiryInfoCardWrapper>
  );
};

EnquiryInfoCard.propTypes = {
  title: PropTypes.string
};

export default EnquiryInfoCard;
