import React from "react";
import { DropzoneDialog } from "material-ui-dropzone";
import { useSnackbar } from 'notistack';
import { uploadDocument } from '../../services/dealerships.service';

const FileUpload = ({id,data, open, onCloseUploader }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleSave = (files) => {
    const formData = new FormData();
    const dealerShipId = id;
    const docID = data.doc_id;
    files.map(file => {
      const fileName = file.name.replace(/[()%.,+\-&]/g, '').toLowerCase().replace(/\s/g, '_');
      formData.append(`file-${id}`, file);
      formData.append(`fileName`, fileName);
      formData.append(`id`, data.doc_id);
    });
    uploadDocument(dealerShipId, docID, formData)
      .then(data => {
        enqueueSnackbar('File Upload Success', { variant: "success" });
        onCloseUploader();
      })
      .catch(e => {
        enqueueSnackbar('File Upload Failed', { variant: "error" });
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
      acceptedFiles={["image/jpeg", "image/png", ".pdf"]}
      showPreviews={true}
      submitButtonText={'Upload'}
      maxFileSize={5000000}
      onClose={onCloseUploader}
    />
  );
};

export default FileUpload;
