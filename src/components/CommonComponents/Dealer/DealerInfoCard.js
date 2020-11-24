import React from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";

export const DealerInfoWrapper = styled.div`
    display: flex;

    .user-initial {
        display: flex;
        align-items: center;
        justify-content: center;    
        color: #FFFFFF;
        font-weight: 600;
        font-size: 36px;
        font-style: normal;
        line-height: 150%;
        text-transform: uppercase;
        width: 64px;
        height: 64px;
        background-color: #4770C1;
        border-radius: 100%;
        margin-right: 20px;
    }

    .user-info-txt {
        flex: 1;
        padding-top: 4px;

        p {
            color: #212323;
            font-size: 18px;
            line-height: 26px;

            &.name {
                font-size: 20px;
                font-weight: bold;
                line-height: 29px;
                margin-bottom: 2px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                /* autoprefixer: off */
                -webkit-box-orient: vertical;
                -moz-box-orient: vertical;
                /* autoprefixer: on */
                overflow: hidden;
            }


            &.dealership-number {
                color: #909191;
                font-size: 16px;
                line-height: 23px;
                margin-bottom: 2px;
            }
        }
    }
`;

export const DealerInfoCardWrapper = styled.div`
    min-height: 160px;
    padding: 24px;
    background-color: #FFFFFF;
    border-radius: 4px;
    margin-bottom: 24px;
    cursor: pointer;

    .title {
        color: #444444;
        font-size: 18px;
        line-height: 26px;
        margin-bottom: 16px;
    }
`;

export const DealerInfo = ({
    userInitial="",
    name="",
    description="",
    dealershipNumber=""
}) => {
    return (
        <DealerInfoWrapper>
            <i className="user-initial">{userInitial}</i>

            <div className="user-info-txt">
                {dealershipNumber ? <p className="dealership-number">{dealershipNumber}</p> : null}
                {name ? <p className="name">{name}</p> : null}
                {description ? <p>{description}</p> : null}
            </div>
        </DealerInfoWrapper>
    );
};

const DealerInfoCard = ({
    title="",
    userInitial="",
    name="",
    description="",
    dealershipNumber="",
    onClick= () => {}
}) => {
    return (
        <DealerInfoCardWrapper onClick={onClick}>
            {title ? <p className="title">{title}</p> : null}
            
            <DealerInfo 
                userInitial={userInitial}
                dealershipNumber={dealershipNumber}
                name={name}
                description={description}
            />
        </DealerInfoCardWrapper>
    );
};

DealerInfo.propTypes = {
    userInitial: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    dealershipNumber: PropTypes.string
};

DealerInfoCard.propTypes = {
    title: PropTypes.string,
    userInitial: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    dealershipNumber: PropTypes.string,
    onClick: PropTypes.func
};

export default DealerInfoCard;
