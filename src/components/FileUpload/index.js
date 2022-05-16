import { DropzoneDialog, DropzoneArea } from 'material-ui-dropzone';
import React from 'react';

export const FILE_FORMAT_IMG = [ 'image/jpeg', 'image/jpg', 'image/png' ]
export const FILE_FORMAT_PDF = [ '.pdf' ]
export const FILE_FORMAT_XLS = [ '.xls', '.xlsx', '.csv' ]
export const FILE_FORMAT_AUDIO = [ '.mp3', '.m4a', '.wav' ]

export const FILE_FORMAT_DEFAULT = [ ...FILE_FORMAT_IMG, ...FILE_FORMAT_PDF, ...FILE_FORMAT_XLS ]

const FileUpload = ({ inline, open, onCloseUploader, title, excel, limit, handleSave, initialFiles=[], FILE_FORMAT = FILE_FORMAT_DEFAULT }) => {
  if(inline) {
    return (
      <DropzoneArea
        showPreviews
        useChipsForPreview
        showPreviewsInDropzone={false}
        previewText="Selected Files"
        onChange={handleSave}
        acceptedFiles={['image/*', '.pdf']}
        maxFileSize={11000000}
        showAlerts={false}
        initialFiles={initialFiles}
      />
    )
  }

  if(excel) {
    return(
      <DropzoneDialog
        open={open}
        dialogTitle={title}
        dialogProps={{
          disableBackdropClick: true
        }}
        onSave={handleSave}
        acceptedFiles={['.xls', '.xlsx', '.csv']}
        showPreviews={true}
        submitButtonText={'Upload'}
        maxFileSize={11000000}
        filesLimit={limit}
        onClose={onCloseUploader}
        initialFiles={initialFiles}
      />
    )
  }

  return (
    <DropzoneDialog
      open={open}
      dialogTitle={title}
      dialogProps={{
        disableBackdropClick: true
      }}
      onSave={handleSave}
      acceptedFiles={FILE_FORMAT}
      showPreviews={true}
      submitButtonText={'Upload'}
      maxFileSize={11000000}
      onClose={onCloseUploader}
      initialFiles={initialFiles}
    />
  );
};

export default FileUpload;
