import React from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";

export const InfoWrapper = styled.div`
    display: flex;

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
                font-size: 18px;
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
            }


            &.caption {
                color: #909191;
                font-size: 16px;
                line-height: 22px;
                margin-bottom: 2px;
            }

            &.light {
                color: #909191;
                font-size: 14px;
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

    .title {
        color: #444444;
        font-size: 16px;
        line-height: 26px;
        margin-bottom: 12px;
    }
`;

export const Info = ({
    userInitial="",
    name="",
    description="",
    caption="",
    content="",
}) => {
    return (
        <InfoWrapper>
            <i className="user-initial">{userInitial}</i>

            <div className="user-info-txt">
                {caption ? <p className="caption">{caption}</p> : null}
                {name ? <p className="name">{name}</p> : null}
                {description ? <p><small>{description}</small></p> : null}
                {content ? <p className="light"><small>{content}</small></p> : null}
            </div>
        </InfoWrapper>
    );
};

const InfoCard = ({
    title="",
    userInitial="",
    name="",
    description="",
    caption="",
    content="",
    onClick= () => {},
    noMargin,
}) => {
    return (
        <InfoCardWrapper noMargin onClick={onClick}>
            {title ? <p className="title">{title}</p> : null}
            
            <Info 
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
