import { Badge, Button, Paper, Typography } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import React , { useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import ListAltIcon from '@material-ui/icons/ListAlt';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import FilePreview from '../../../components/CommonComponents/FilePreview';

const imgFileTypes = ['jfif', 'pjpeg', 'jpeg', 'pjp', 'jpg', 'png'];
const csvFileTypes = ['csv', 'xls', 'xlsx'];
const useStyles = makeStyles((theme) => ({
    root: {
        // margin: 10,
        padding: 10,
        // border: '2px solid red',
        // borderRadius: 5,
        // boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px'
        borderBottom: '1px solid #CCC'
    },
    titleRow: {
        // border: '2px solid red',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 5,
    },
    titleBtns: {

    },
}))


const DocPreview = ({fileType, url, DocName}) => {
    const useStyles = makeStyles((theme) => ({
        container: {
            transition: 'all .2s ease-in-out',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#fcfcfc'
            },
            border: '1px dashed grey',
            width: 100,
            height: 75,
            borderRadius: 6,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center', 
            margin: '8px 0px 8px 15px'
        }
    }))

    const [imageModal, setImageModal] = useState({});
    const classes = useStyles();
    const fileName = url?.split('/')[5]
    return(
        <>
        {
            url ? (
                        <Tooltip title={fileName}>
                            <span>
                                <div className={classes.container}
                                    onClick={() => csvFileTypes.includes(fileType) ? window.open(url) : setImageModal({ open: true, image: url, type: fileType})} 
                                >
                                    {
                                        imgFileTypes.includes(fileType) ? 
                                            <img src={url} height="100%" width="100%" style={{borderRadius: 6, padding: 1, objectFit: 'cover'}} />
                                            : fileType === 'pdf' ?
                                                <PictureAsPdfIcon style={{color: '#63686E'}}/>
                                                : <ListAltIcon style={{color: '#63686E'}}/>
                                    }
                                </div>
                                <h5 style={{ width: 100, whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginTop: 2, overflow: 'hidden', marginLeft: 15 }}>{fileName}</h5>
                            </span>
                        </Tooltip>
                
            ) : (
                <Typography variant='h7' style={{color: '#b5b5b5', marginLeft: 15 }}>No Documents!</Typography>
            )
        }
            <FormDialog title={DocName} onDownload={imageModal?.image} open={imageModal?.open} onClose={() => setImageModal({ open: false })}>
                <FilePreview data={imageModal}/>
            </FormDialog>
        </>
    )
}

const DocListPreview = ({DocName, upload, deleteDocs, file, id}) => {
  const classes = useStyles();
  const [collapse, setCollapse] = useState(false);

  const handleCollapse = () => {
    setCollapse(!collapse)
}
    return (
        <div className={classes.root}>
            <div className={classes.titleRow}>
                <div onClick={() => handleCollapse()} style={{cursor: 'pointer'}}>
                    <Typography variant='h7' onClick={() => handleCollapse}><strong>{`${id}. ${DocName}`}</strong></Typography>
                    <Badge badgeContent={file[0].file_url && file?.length || 0} color="primary" style={{marginLeft: 15}}/>
                </div>
                <div className={classes.titleBtns}>
                    {
                        file[0].file_url && file?.length >= 1 && (
                            <Button size='small' onClick={deleteDocs} style={{ color: '#FF5C58', borderColor: '#FF5C58'}} startIcon={<DeleteForeverIcon style={{fontSize: 'small'}}/>}>Delete</Button>
                        )
                    }
                        <Button size='small' style={{marginLeft: 15}} variant='outlined' onClick={upload} color='primary' startIcon={<AddIcon style={{fontSize: 'small'}}/>}>Upload</Button>
                </div>
            </div>
            <div 
                style={{display: 'flex', flexWrap: 'wrap'}}
            >
                {
                    file.map((data, i) => {
                        return(
                                !collapse? (
                                    <DocPreview fileType={data.file_type} url={data.file_url} DocName={DocName}/>
                                ) : (
                                    null
                                )
                        )
                    })
                }
            </div>
        </div>
    )
}

export default DocListPreview
