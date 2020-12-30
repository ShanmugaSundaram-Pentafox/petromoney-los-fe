import React from "react";
import { DropzoneDialog, DropzoneArea } from "material-ui-dropzone";

const FileUpload = ({id,data, inline, open, onCloseUploader, handleSave }) => {
  if(inline) {
    return (
      <DropzoneArea
        showPreviews
        useChipsForPreview
        showPreviewsInDropzone={false}
        previewText="Selected Files"
        onChange={handleSave}
        acceptedFiles={["image/*", ".pdf"]}
        maxFileSize={5000000}
        showAlerts={false}
      />
    )
  }

  return (
    <DropzoneDialog
      open={open}
      dialogTitle={'Upload Dealership Document'}
      dialogProps={{
          disableBackdropClick: true
      }}
      onSave={handleSave}
      acceptedFiles={["image/jpeg", "image/png", ".pdf", ".xls", ".xlsx", ".csv"]}
      showPreviews={true}
      submitButtonText={'Upload'}
      maxFileSize={5000000}
      onClose={onCloseUploader}
    />
  );
};

export default FileUpload;
