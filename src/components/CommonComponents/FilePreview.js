import { Image, Loader, Text } from '@mantine/core';
import { Avatar, Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import FormDialog from './FormDialog/FormDialog';
import { getSignedUrl } from '../../services/common.service';

const useStyles = makeStyles(() => ({
  title: {
    fontSize: 11,
    color: '#888',
  },
  details: {
    borderColor: 'grey',
    minWidth: 80,
    // minHeight: 45,
    maxWidth: 250,
    textAlign: 'left',
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    display: 'flex',
    alignItems: 'center'
  },
  avatarCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))

const PreviewWrapper = styled.div`
  width:100%;
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

export const ViewData = ({ title, value, endIcon, loading = false }) => {
  return (
    <>
      <Text size="sm" fw="600" c="gray.7">{title}</Text>

      <Text
        size="sm"
        c="gray.6"
        className="flex items-center gap-2"
      >
        {loading ? <Loader size={'xs'} type='dots' /> : (value ? value : '-')}

        {!loading ? endIcon : null}
      </Text>
    </>
  )
}

export const AvatarCard = ({ file, title, tooltip }) => {
  const classes = useStyles()
  const [imageModal, setImageModal] = useState({})

  return (
    <>
      <div onClick={() => setImageModal({ open: true, image: file, type: file?.endsWith('.pdf') })} style={{ margin: 10, paddingLeft: 10 }} tabIndex={0} role="button" onKeyDown={'click'}>
        <Tooltip title={tooltip}>
          <div className={classes.avatarCard}>
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


const FilePreview = ({ data, title }) => {
  const [signedUrl, setSignedUrl] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data?.image) {
      setLoading(true);
      getSignedUrl(data?.image)
        .then((res) => {
          setSignedUrl(res?.url)
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }

  }, [data?.image])
  return (
    loading ? (
      < Image
        src={null}
        h={'auto'}
        maw={500}
        fallbackSrc={'https://placehold.co/600x400?text=Loading...'}
      />
    ) : (
      <PreviewWrapper>
        {
          (data?.type == true || data?.type == 'pdf') ?
            (title == 'Leegality') ? (
              <div className="iframe-container">
                <iframe title='File Preview' src={signedUrl} frameBorder="0" ></iframe>
              </div>
            ) : (
              <div style={{ width: '45vw', height: '80vh', paddingTop: 16 }}>
                <iframe style={{ width: '100%', height: '100%' }} title='File Preview' src={signedUrl} frameBorder="0" ></iframe>
              </div>
            )
            :
            // eslint-disable-next-line react/jsx-indent
            <Image
              src={signedUrl}
              h={'auto'}
              maw={500}
              fallbackSrc={'https://placehold.co/600x400?text=Not%20%20Found!'}
            />
        }
      </PreviewWrapper>
    )
  )

}

export default FilePreview;