import { Box, SimpleGrid } from '@mantine/core';
import React from 'react';
import { ViewData } from '../../../components/CommonComponents/FilePreview';


const DealershipData = ({ data, loanData }) => {
  return (
    <Box>
      {data && (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
          <div>
            <ViewData title='Name' value={data.name || '-'} />
          </div>
          <div>
            <ViewData title='Address' value={data.address || '-'} />
          </div>  
          <div>
            <ViewData title='PAN' value={data.pan || '-'} />
          </div>  
          <div>
            <ViewData title='Region' value={data.region_name || '-'} />
          </div>
          <div>
            <ViewData title='Pincode' value={data.pincode || '-'} />
          </div>  
          <div>
            <ViewData title='GST' value={data.gst || '-'} />
          </div>
          {loanData?.status === 'disbursed' ? (
            <div>
              <ViewData title='Status' value={loanData?.is_noc == 1 ? 'NOC Issued' : 'Active'} /> 
            </div>
          ) : null}
        </SimpleGrid>
      )}
    </Box>
  )
}
export default DealershipData;