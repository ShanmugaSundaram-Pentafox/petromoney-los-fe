import { DropzoneDialog, DropzoneArea } from 'material-ui-dropzone';
import React from 'react';

const FileUpload = ({id,data, inline, open, onCloseUploader, title, excel, limit, handleSave, initialFiles=[], format = ['image/jpeg', 'image/png', '.pdf', '.xls', '.xlsx', '.csv'] }) => {
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
      acceptedFiles={format}
      showPreviews={true}
      submitButtonText={'Upload'}
      maxFileSize={11000000}
      onClose={onCloseUploader}
      initialFiles={initialFiles}
    />
  );
};

export default FileUpload;
