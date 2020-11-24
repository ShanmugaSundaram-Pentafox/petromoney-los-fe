import React, { Fragment } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";
import { InfoBoxStyle } from "../../../theme/styled-components/utils";

export const PhotoCardCardWrapper = styled(InfoBoxStyle)`
    padding: 32px;
    min-height: 350px;
    margin-bottom: 24px;

    .title {
        color: #222444;
        font-size: 18px;
        line-height: 26px;
        margin-bottom: 16px;
    }

    .photo-wrap {
        display: flex;

        .main-photo {
            position: relative;
            width: 444px;
            height: 244px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            background-color: #F7F7F7;
            overflow: hidden;
            transition: all 0.3s ease 0s;
            
            &:hover:before {
                transform: scale(1.1);
            }

            &:before {
                content: "";
                position: absolute;
                left: 0px;
                top: 0px;
                right: 0px;
                bottom: 0px;
                background: inherit;
                transition: inherit;
            }            
        }

        .photo-list {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            margin-left: 24px;

            span {
                width: 42px;
                height: 44px;
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;
                background-color: #F7F7F7;
                cursor: pointer;

                &:not(:last-child) {
                    margin-bottom: 6px;
                }
            }
        }

    }
`;

const PhotoCard = ({
    title="",
    photos= []
}) => {

    const renderPhotos = (photos) => {
        if (photos.length > 5) {
            photos.splice(5, photos.length);
        }
    
        return photos.map((photo, index) => {
          return (
            <Fragment key={index}>
                <span style={{backgroundImage: `url(${photo})`}}></span>
            </Fragment>
          );
        });
    };

    return (
        <PhotoCardCardWrapper>
            <p className="title">{title}</p>

            <div className="photo-wrap">
                <figure 
                    style={{backgroundImage: `url('https://bit.ly/2SB6BEy')`}}
                    className="main-photo"
                />

                <div className="photo-list">
                    {photos && photos.length ? (
                        renderPhotos(photos)
                    ) : (
                    <div />
                    )}
                </div>
            </div>
        </PhotoCardCardWrapper>
    );
};

PhotoCard.propTypes = {
    title: PropTypes.string,
};

export default PhotoCard;
