import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const FileInputWrapper = styled.div`
  position: relative;
  margin-bottom: 24px;

  .upload-file-wrapper {
    position: relative;
    padding-left: 128px;
    min-height: 56px;
    margin-bottom: 4px;

    .upload-file-btn {
      position: absolute;
      top: 0px;
      left: 0px;
      display: inline-block;
      color: #FFFFFF;
      padding: 10px 24px;
      background-color: #5498FF;
      border-radius: 2px;
      overflow: hidden;

      span {
        font-size: 15px;
        font-weight: 500;
        line-height: 22px;
        margin-right: 4px;
      }

      .attach-file-icon {
        transform: rotate(45deg) scale(-1);
        font-size: 16px;
      }

      span, .attach-file-icon {
        vertical-align: middle;
      }

      .file-input {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        z-index: 1;
        width: 100%;
        cursor: pointer;
      }
    }
  }

  .upload-text-caption {
    color: rgba(34, 36, 68, .8);
    font-size: 14px;
    line-height: 21px;
    margin-bottom: 2px;
  }

  .max-no-photos {
    color: #4883DB;
    font-size: 14px;
    line-height: 21px;
    margin-bottom: 0;
  }

  .upload-img-list-item-info {
    display: flex;
    flex-flow: row wrap;

      
    .upload-img-list-item, .upload-progress-info {
      max-width: 40px;
      position: relative;
      display: flex;
      align-items: center;
      flex-flow: column wrap;
      margin: 0 16px 12px 0;

      .cancel-rounded-icon {
        position: absolute;
        top: -8px;
        color: #FF7777;
        font-size: 14px;
        cursor: pointer;
      }

      figcaption, .upload-thumbnail {
        color: #222444;
        max-width: 40px;
        font-size: 8px;
        font-weight: 300;
        line-height: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: 6px;
      }
    }
      
    .upload-img-list-item { 
      .cancel-rounded-icon {
        right: -15px;
      }

      img {
        width: 40px;
        height: 40px;
      }
    }

    .upload-progress-info {
      .cancel-rounded-icon {
        right: -6px;
      }

      .circular-progress-color {
        color: #93BB88;
      }
    }
  }
`;


function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress className="circular-progress-color" variant="determinate" {...props} color="red" />

      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export const FileInput = ({
  uploadFileButtonName = "Attach",
  uploadFileButtonCaption = "Photos of Roof Space with Direction Indicator",
  maxNoPhotos = 5
}) => {
  const [progress, setProgress] = useState(10);
  const [files, setFiles] = useState();


  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <FileInputWrapper>
      <div className="upload-file-wrapper">
        <div class="upload-file-btn">
          <input type="file" class="file-input" onChange={e => {  }} />

          <span>{uploadFileButtonName}</span>
          <AttachFileIcon className="attach-file-icon" />
        </div>

        <div className="upload-img-list-item-info">
          <div className="upload-progress-info">
            <CancelRoundedIcon className="cancel-rounded-icon" />

            <CircularProgressWithLabel value={progress} />
            <span className="upload-thumbnail">Uploading</span>
          </div>

          <figure className="upload-img-list-item">
            <CancelRoundedIcon className="cancel-rounded-icon" />

            <img src="https://i.imgur.com/7TafYrR.png" />
            <figcaption className="upload-img-list-item-name">Imj.251</figcaption>
          </figure>
        </div>
      </div>

      {uploadFileButtonCaption && <p className="upload-text-caption">{uploadFileButtonCaption}</p>}
      {maxNoPhotos ? <p className="max-no-photos">(Max {maxNoPhotos} photos)</p> : null}
    </FileInputWrapper>
  );
};

FileInput.propTypes = {
  uploadFileButtonName: PropTypes.string,
  uploadFileButtonCaption: PropTypes.string,
  maxNoPhotos: PropTypes.number
};

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default FileInput;
