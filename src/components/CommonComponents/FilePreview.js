import React, { useState } from 'react'
import PdfViewer from './PdfViewer/PdfViewer';
import styled from "styled-components";
import { makeStyles } from "@material-ui/styles";
import { Box } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { Avatar } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import FormDialog from './FormDialog/FormDialog';

const useStyles = makeStyles((theme) => ({
    title: {
        // marginBottom: 4,
        fontSize: 11,
        color: '#888',
    },
    details: {
        borderColor: 'grey',
        minWidth: 80,
        // minHeight: 50,
        maxWidth: 250,
        // display: 'flex',
        textAlign: 'left',
        // alignItems: 'left',
        // justifyContent: 'left',
        marginBottom: 8,
    },
    text: {
        fontSize: 12
    },
}))

const PreviewWrapper = styled.div`
    width:45vw;
    .image {
        width: 100%;
        object-fit: contain;
        }
    .iframe-container {
        height:72vh;
        overflow: hidden;
        padding-top: 45%;
        position: relative;
    }
    .iframe-container iframe {
        width:100%;
        height:100%;
        left: 0;
        position: absolute;
        top: 0;
    }
`;

export const ViewData = ({ title, value }) => {
    const classes = useStyles()
    return (
        <Box className={classes.details}>
            <p className={classes.title}>{title}</p>
            <strong className={classes.text}>{value ? value : '-'}</strong>
        </Box >
    )
}
export const AvatarCard = ({ file, title, tooltip }) => {
    const classes = useStyles()
    const [imageModal, setImageModal] = useState({})
    return (
        <>
            <div onClick={() => setImageModal({ open: true, image: file, type: file.endsWith('.pdf') })} >
                <Tooltip title={tooltip}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Avatar src={`${file}`} />
                        <Typography style={{ marginTop: 4 }}>{title}</Typography>
                    </div>
                </Tooltip>
            </div>
            <FormDialog className={classes.dialogBox} title={title} onDownload={imageModal.image} open={imageModal.open} onClose={() => setImageModal({ open: false })}>
                <FilePreview data={imageModal} />
            </FormDialog>
        </>
    )
}


const FilePreview = ({ data }) => {
    return (
        <PreviewWrapper>
            {/* {
                ['jpg', 'png', 'jpeg'].includes(data.type) ?
                    <img className="image" src={data.image} alt="image-viewer" /> :
                    <div className="iframe-container">
                        <PdfViewer file={data.image} /> 
                        <iframe src={data.image} frameBorder="0" ></iframe>
                    </div>
            } */}
            {
                data.type ?
                    <div className="iframe-container">
                        <iframe src={data.image} frameBorder="0" ></iframe>
                    </div> :
                    <img className="image" src={data.image} alt="image-viewer" />
            }
        </PreviewWrapper>
    )

}
export default FilePreview;