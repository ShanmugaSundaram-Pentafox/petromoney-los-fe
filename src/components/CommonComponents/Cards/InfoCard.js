import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';

export const InfoWrapper = styled.div`
    // display: flex;
    min-height:17vh;


    .card-body {
        display: flex;
        padding: 10px 10px;
      }
    .user-initial {
        display: flex;
        align-items: center;
        justify-content: center;    
        color: #FFFFFF;
        font-weight: 600;
        font-size: 24px;
        font-style: normal;
        line-height: 150%;
        text-transform: uppercase;
        width: 52px;
        height: 52px;
        background-color: #4770C1;
        border-radius: 100%;
        margin-right: 20px;
    }

    .user-info-txt {
        flex: 1;
        padding-top: 4px;

        p {
            color: #212323;
            font-size: 16px;
            line-height: 22px;

            &.name {
                font-size: 12px;
                font-weight: bold;
                line-height: 24px;
                margin-bottom: 2px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                /* autoprefixer: off */
                -webkit-box-orient: vertical;
                -moz-box-orient: vertical;
                /* autoprefixer: on */
                overflow: hidden;
                text-transform: capitalize;
            }


            &.caption {
                color: #909191;
                font-size: 14px;
                line-height: 22px;
                margin-bottom: 2px;
                text-transform: capitalize;
            }

            &.light {
                color: #909191;
                font-size: 12px;
                line-height: 16px;
            }
        }
    }
`;

export const InfoCardWrapper = styled.div`
    min-height: 140px;
    
    padding: 24px;
    background-color: #FFFFFF;
    border-radius: 4px;
    margin-bottom: ${props => props.noMargin ? 0 : '24px'};
    cursor: pointer;
    
    ${props => props.hover && css`
        &:hover {
            background-color: ${props => props.hover ? '#e0ffe2' : '#fff'};
            box-shadow: 0 0 8px #f1f1f1; 
        }
    `}
    .title {
        color: #444444;
        font-size: 16px;
        line-height: 26px;
        margin-bottom: 12px;
        text-transform: capitalize;
    }
`;

export const Info = ({
  title,
  userInitial = '',
  name = '',
  description = '',
  caption = '',
  content = '',
}) => {
  return (
    <InfoWrapper>
      <div className="card-body">
        <i className="user-initial">{userInitial}</i>
        <div className="user-info-txt">
          {caption ? <p className="caption">{caption}</p> : null}
          {name ? <p className="name">{name}</p> : null}
          {description ? <p><small>{description}</small></p> : null}
          {content ? <p className="light"><small>{content}</small></p> : null}
        </div>

      </div>

    </InfoWrapper>
  );
};

const InfoCard = ({
  title = '',
  userInitial = '',
  name = '',
  description = '',
  caption = '',
  content = '',
  onClick = () => { },
  hover,
  noMargin,
}) => {
  return (
    <InfoCardWrapper noMargin={noMargin} hover={hover} onClick={onClick}>
      {title === 'Transport Info' ? (
        <p className="title">{title} &nbsp;&nbsp;
          <IconButton
            color="primary"
            aria-label="edit owner"
            component="span"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </p>

      ) : title ? <p className="title">{title}</p> : null}
      {/* {
                    title === 'Transport Info' && (
                        <div style={{ float: 'right' }}>
                            
                        </div>
                    )
                }
            </div> */}

      <Info
        title={title}
        userInitial={userInitial}
        caption={caption}
        name={name}
        description={description}
        content={content}
      />
    </InfoCardWrapper>
  );
};

Info.propTypes = {
  userInitial: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  caption: PropTypes.string
};

InfoCard.propTypes = {
  title: PropTypes.string,
  userInitial: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  caption: PropTypes.string,
  onClick: PropTypes.func
};

export default InfoCard;
