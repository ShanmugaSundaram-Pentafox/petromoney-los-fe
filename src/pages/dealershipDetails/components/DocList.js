import { Loader, Title } from '@mantine/core';
import { groupBy } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import DocListPreview from './DocListPreview';
import FileUpload, { FILE_FORMAT_ALL } from '../../../components/FileUpload';
import { permissionCheck } from '../../../components/UserCan/UserCan';
import { URL } from '../../../config/serverUrls';
import { rulesList } from '../../../config/userRules';
import { getDealershipCheckList } from '../../../services/dealerships.service';

const DocList = ({ id, currentUser }) => {
  const queryClient = useQueryClient()
  const [showUpload, setShowUpload] = useState(false);
  const [rowData, setRowData] = useState();
  const editable = permissionCheck(currentUser.role_name, rulesList.external_view);

  const { data: checkListData = {}, isLoading: checklistLoading } = useQuery(
    ['doc-checklist', id],
    () => getDealershipCheckList(id),
    {
      refetchOnWindowFocus: false,
      select: (data) => {
        return groupBy(data, 'doc_stage')
      }
    }
  )

  const { enqueueSnackbar } = useSnackbar();
  const onCloseUploader = () => {
    setShowUpload(false);
  }

  const onDocUpload = (row) => {
    setShowUpload(true);
    setRowData(row);
  };

  const handleSave = (files) => {
    const formData = new FormData();
    const dealerShipId = id;
    const docID = rowData.doc_id;
    files.map(file => {
      const fileName = file.name.replace(/[()%.,+\-&]/g, '').toLowerCase().replace(/\s/g, '_');
      formData.append(rowData?.kyc_file_name ? rowData?.kyc_file_name : 'file', file);
      formData.append('fileName', fileName);
      formData.append('id', rowData.doc_id);
    });


    fetch(`${URL.base}${URL.checklist}/${dealerShipId}/doc/${docID}`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    }).then(res => res?.json())
      .then(data => {
        if (data?.status?.toLowerCase() === 'error') {
          enqueueSnackbar(data?.message, { variant: 'error' });
        } else {
          enqueueSnackbar('File Upload Success', { variant: 'success' });
        }
        onCloseUploader();
        queryClient.invalidateQueries(['doc-checklist', id])
      })
      .catch(error => {
        enqueueSnackbar('File Upload Failed', { variant: 'error' });
      })
  };


  return (
    <>
      {showUpload && (
        <FileUpload
          id={id}
          handleSave={handleSave}
          data={rowData}
          title='Upload Dealership Document'
          open={showUpload}
          onCloseUploader={onCloseUploader}
          FILE_FORMAT={rowData.doc_id == '17' ? FILE_FORMAT_ALL : undefined}
        />
      )}
      {(!checklistLoading && Object.entries(checkListData)?.length) ?
        Object.entries(checkListData)?.reverse()?.map((item, index) => (
          <div key={index}>

            <Title order={3} mb="lg">{item?.[0]?.replace(/_/, ' ')?.toUpperCase()} DOCUMENTS</Title>

            {Array.isArray(item?.[1]) && item?.[1]?.map((row, i) => row.doc_type !== 'dealer' && (
              <DocListPreview
                key={i}
                currentUser={currentUser}
                docName={row.description}
                upload={() => onDocUpload(row)}
                file={row.file_data}
                docId={row?.doc_id} id={i + 1}
                dealershipId={id}
                editable={editable}
              />
            ))}
          </div>
        )) : checklistLoading ? <Loader /> : <center>No data to display</center>}
    </ >

  );
};

export default DocList;
