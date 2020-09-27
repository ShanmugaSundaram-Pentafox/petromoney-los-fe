

import React from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";


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
    min-width: 216px;
    padding: 14px;
    display: flex;
    align-items: center;
    background-color: #E9ECF3;
    border-radius: 16px;
    transition: all .4s ease;
    margin: 0 0 16px;
    cursor: pointer;

    i {
        min-width: 56px;
        min-height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 6px;
        font-weight: 500;
        font-size: 24px;
        font-style: normal;
        color: #FFFFFF;
        background-color: #2d6839;
        border-radius: 16px;
        margin-right: 12px;
    }

    p {
        margin-bottom: 0;

        span {
            display: block;
            color: #000000;
            font-size: 13px;
            line-height: 15px;
            font-weight: 500;
            
            &.title {
                margin-bottom: 4px;
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
    action= () => {}
}) => {
    return (
        <InfoBoxCard onClick={action}>
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
