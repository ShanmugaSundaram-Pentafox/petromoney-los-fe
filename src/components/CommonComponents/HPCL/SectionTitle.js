import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const SectionTitleWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${props => `${props.marginBottom || 24}px`};

    p {
        margin-bottom: 0px;

        &.title {
            color: #222444; 
            font-size: 20px;
            font-weight: bold;
            line-height: 29px;
        }
        &.txt {
            color: #444444;
            font-size: 16px;
            line-height: 140%;
            margin-top: 10px;
        }
    }
`;

const SectionTitle = ({
  title,
  description,
  renderLeftElement,
  renderRightElement,
  marginBottom
}) => {
  return (
    <SectionTitleWrapper marginBottom={marginBottom}>
      {!renderLeftElement ? 
        <div className="left-content">
          <p className="title">{title}</p>
          {description ? <p className="txt">{description}</p> : null}
        </div>
        :
        renderLeftElement
      }

      {renderRightElement ? renderRightElement : null}
    </SectionTitleWrapper>
  );
};

SectionTitle.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  renderLeftElement: PropTypes.element,
  renderRightElement: PropTypes.element,
  marginBottom: PropTypes.number
};

export default SectionTitle;
