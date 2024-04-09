import React, { useMemo, useState, } from 'react';
import { getSignedUrl } from '../../services/common.service';
import { downloadEnhancementData, getEnhancedLoanByStatus, getPageDetails } from '../../services/enhancement.service';
import DataTableViewer from '../../components/ReactTable/DataTableViewer';
import { useQuery } from 'react-query';
import { displayNotification } from '../../components/CommonComponents/Notification/displayNotification';
import classes from './Enhancement.module.css';
import column from './EnhancementColumns';

const EnhancementTableList = ({ onRowClick, filterQry, status, statusList, statusChange }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState();

  const getEnhancementDataQuery = useQuery({
    queryKey: ['enhancement-data', status, filterQry, page, search],
    queryFn: () => getEnhancedLoanByStatus(status, filterQry, page, search),
  })

  const getEnhancementPaginationQuery = useQuery({
    queryKey: ['enhancement-pagination', status, filterQry],
    queryFn: () => getPageDetails(status, filterQry),
  })

  const enhancementDownloadQuery = useQuery({
    queryKey: ['enhancement-download', status,],
    queryFn: () => downloadEnhancementData(status, filterQry),
    onSuccess: (data) => {
      getSignedUrl(data[0]?.url)
        .then((res) => {
          window.open(res?.url, '_blank');
        })
        .catch(e => {
          displayNotification({ message: e, variant: 'error' });
        })
    },
    onError: (e) => {
      displayNotification({ message: e, variant: 'error' })
    },
    enabled: Boolean(false),
  })

  const getColumnData = useMemo(() => {
    const columns = {
      submitted: [...column.submitted],
    }
    return columns[status]
  }, [status])

  return (
    <div className={classes.root}>
      <DataTableViewer
        rowData={getEnhancementDataQuery?.data}
        column={getColumnData}
        title={'Enhancement List'}
        count={getEnhancementDataQuery?.data?.length}
        onRowClick={(i) => onRowClick(i.dealership_id, i, 'submit')}
        useAPIPagination
        apiSearch={setSearch}
        page={page}
        setPage={setPage}
        statusTab={{ show: true, list: statusList }}
        statusChange={{ status, handleChange: statusChange }}
        totalNoOfPages={getEnhancementPaginationQuery?.data?.total_number_of_pages}
        filter={false}
        columnsFilter={false}
        loading={getEnhancementDataQuery?.isLoading}
        excelDownload
        downloadQuery={{ query: enhancementDownloadQuery?.refetch, isLoading: enhancementDownloadQuery?.isFetching }}
      />
    </div>
  )
}

export default EnhancementTableList
