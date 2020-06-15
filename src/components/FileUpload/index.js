import React from "react";
import { DropzoneDialog } from "material-ui-dropzone";
import { updateDocument } from '../../services/dealerships.service';
import { logger } from '../../config/logger';

const FileUpload = ({id,data, open, onCloseUploader }) => {
  const handleSave = (files) => {
    const formData = new FormData();
    files.map(file => {
      const docName = data.doc_name.replace(/[()%.,+\-&]/g, '').toLowerCase().replace(/\s/g, '_');
      formData.append(`file-${id}`, file);
      formData.append(`fileName`, docName);
      formData.append(`id`, data.doc_id);
    });
    updateDocument(id, formData)
      .then(data => {
        logger('FileUpload Success');
        onCloseUploader();
      })
      .catch(e => {
        logger('File Upload Failed', data.data);
      });
  };

  return (
    <DropzoneDialog
      open={open}
      dialogTitle={'Upload Dealership Document'}
      dialogProps={{
          disableBackdropClick: true
      }}
      onSave={handleSave}
      acceptedFiles={["image/jpeg", "image/png"]}
      showPreviews={true}
      submitButtonText={'Upload'}
      maxFileSize={5000000}
      onClose={onCloseUploader}
    />
  );
};

export default FileUpload;
