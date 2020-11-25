

import React from "react";
import PropTypes from 'prop-types';
import styled, { css } from "styled-components";


export const InfoBoxContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 20px 24px 8px;
    /* margin-bottom: 32px; */
`;

export const InfoBoxWrapper = styled.div`
    width: ${props => props.width || 'auto'};
    height: ${props => props.height || 'auto'};
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: flex-start;
    /* justify-content: space-between; */
    align-items: center;
    background-color: #ffffff;
    padding: 10px;
    border-radius: 6px;
    /* box-shadow: 0 8px 6px -6px rgba(0,0,0,0.12); */
    /* margin-right: 30px; */
`;

const InfoBoxCard = styled.div`
    width: 100%;
    padding: 12px;
    display: flex;
    align-items: center;
    color: #000000;
    background-color: #fff;
    border-radius: 2px;
    transition: all .2s ease-in-out;
    cursor: pointer;
    margin-bottom: 8px;

    i {
        /* min-width: 56px;
        min-height: 56px; */
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5px;
        font-weight: 500;
        font-size: 13px;
        font-style: normal;
        color: #FFFFFF;
        background-color: #4770C1;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 8px;
    }

    &:hover {
        background-color: #4770C1;
        color: #fff;

        i {
            background-color: #fff;
            color: #4770C1;
        }
    }

    ${props => props.active && css`
        background-color: #4770C1;
        color: #fff;

        i {
            background-color: #fff;
            color: #4770C1;
        }
    `}

    p {
        margin-bottom: 0;
        vertical-align: middle;

        span {
            display: block;
            font-size: 14px;
            line-height: 14px;
            font-weight: 500;
            
            &.title {
                /* margin-bottom: 4px; */
            }

            &.txt {
                color: #504E58;
                font-size: 12px;
                line-height: 15px;
                font-weight: 500;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                /* autoprefixer: off */
                -webkit-box-orient: vertical;
                -moz-box-orient: vertical;
                /* autoprefixer: on */
                overflow: hidden;
            }
        }
    }
`;

export const InfoBox = ({
    number= "",
    title= "",
    text= "",
    active,
    action= () => {},
}) => {
    return (
        <InfoBoxCard active={active} onClick={action}>
            {number ? <i>{number}</i> : null}
            <p>
                {title ? <span className="title">{title}</span> : null}
                {text ? <span className="txt">{text}</span> : null}
            </p>
        </InfoBoxCard>
    );
};

InfoBox.propTypes = {
    number: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    action: PropTypes.func
};

export default InfoBox;
