import { Box, SimpleGrid } from '@mantine/core';
import React from 'react';
import { ViewData } from '../../../components/CommonComponents/FilePreview';


const DealershipData = ({ data, loanData }) => {
  return (
    <Box px="sm">
      {data && (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          <div>
            <ViewData title='Name' value={data.name || '-'} />
            <ViewData title='Address' value={data.address || '-'} />
            <ViewData title='PAN' value={data.pan || '-'} />
          </div>
          
          <div>
            <ViewData title='Region' value={data.region_name || '-'} />
            <ViewData title='Pincode' value={data.pincode || '-'} />
            <ViewData title='GST' value={data.gst || '-'} />
            {(loanData?.status === 'disbursed') ? <ViewData title='Status' value={loanData?.is_noc == 1 ? 'NOC Issued' : 'Active'} /> : null}
          </div>
        </SimpleGrid>
      )}
    </Box>
  )
}
export default DealershipData;