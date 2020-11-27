import React from "react";
import { DropzoneDialog } from "material-ui-dropzone";

const FileUpload = ({id,data, open, onCloseUploader, handleSave }) => {
 
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
