import React from "react";
import { DropzoneDialog, DropzoneArea } from "material-ui-dropzone";

const FileUpload = ({id,data, inline, open, onCloseUploader, handleSave, initialFiles=[] }) => {
  if(inline) {
    return (
      <DropzoneArea
        showPreviews
        useChipsForPreview
        showPreviewsInDropzone={false}
        previewText="Selected Files"
        onChange={handleSave}
        acceptedFiles={["image/*", ".pdf"]}
        maxFileSize={11000000}
        showAlerts={false}
        initialFiles={initialFiles}
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
      maxFileSize={11000000}
      onClose={onCloseUploader}
      initialFiles={initialFiles}
    />
  );
};

export default FileUpload;
