import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import styled from 'styled-components';
import FormDialog from '../../../components/CommonComponents/FormDialog/FormDialog';
import TextInput from '../../../components/TextInput/TextInput';

const ViewMoreBtn = styled.div`
  position: absolute;
  bottom: 5px;
  width: 100%;
  text-align: center;
  padding: 5px;
  padding-top: 15px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(176,176,176,0.75) 100%);
  transition: all .35s ease-in-out;

  &:hover {
    background: linear-gradient(180deg, rgba(255,255,255,0.50) 0%, rgba(176,176,176,0.90) 100%);
  }
`;

const fieldProps = {
  direction: 'column',
  alignTop: true,
}

const LoanStatusRemarks = ({ data: row }) => {
  const [showRemarksModal, setShowRemarksModal] = useState(false);

  return (
    <>
      <Grid container>
        <Grid item xs={12} style={{ position: 'relative' }}>
          Recommendation Remarks(for Approval):
          <TextInput
            disabled
            alignTop
            multiline
            rows={4}
            // rowsMax={8}
            value={row?.recommendation_remarks}
            {...fieldProps}
          />
          {
            row?.recommendation_remarks?.length >= 300 ? (
              <ViewMoreBtn onClick={() => setShowRemarksModal(row?.recommendation_remarks)}>
                View more
              </ViewMoreBtn>
            ) : null
          }
        </Grid>
      </Grid>
      {
        row?.disbursement_recommendation_remarks && (
          <Grid container>
            <Grid item xs={12} style={{ position: 'relative' }}>
              Recommendation Remarks(for Disbursement):
              <TextInput
                disabled
                readOnly
                alignTop
                multiline
                rows={4}
                // rowsMax={8}
                value={row.disbursement_recommendation_remarks}
              />

              {
                row.disbursement_recommendation_remarks?.length >= 300 ? (
                  <ViewMoreBtn onClick={() => setShowRemarksModal(row.disbursement_recommendation_remarks)}>
                    View more
                  </ViewMoreBtn>
                ) : null
              }
            </Grid>
          </Grid>
        )
      }
      <FormDialog open={showRemarksModal} title="Remarks" onClose={() => setShowRemarksModal(false)}>
        <TextInput
          disabled
          alignTop
          multiline
          readOnly
          value={showRemarksModal}
          style={{ width: '40vw', minWidth: 400 }}
        />
      </FormDialog>
    </>
  );
}

export default LoanStatusRemarks;