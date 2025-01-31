import {
  ActionIcon,
  Box,
  Image,
  Paper,
  ScrollArea,
  Skeleton,
  Table,
  Text,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconChevronsRight, IconChevronsLeft } from '@tabler/icons-react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedUniqueValues,
  getFacetedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import COLORS from '../../theme/colors';

const classes = {
  expressContainer: {
    width: '8px',
    height: '100%',
    padding: 2,
    background: COLORS.orange(100),
    color: 'white',
    left: 0,
    position: 'absolute',
  },
  expressInner: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    bottom: '50%',
    left: '-12.5px',
    rotate: '270deg',
    fontSize: '6px',
    fontWeight: 600,
  }
}

// render the table view
// using the mantine and react table.
const ReactTable = ({
  rowData = [],
  columnData,
  onRowClick = () => null,
  setFilterHeader,
  filterHeader,
  search,
  setSearch,
  allowSorting = false,
  loading,
  page,
  setPage,
  useApiPagination = false,
  totalNoOfRecords,
  totalNoOfPages,
  sorting,
  setSortingValue,
  apiSorting = false,
  isSortingRemoval = true,
  styles,
  setFilteredData,
  noDataText = 'No data yet!',
  noDataSubText = 'No data found in this section',
  isApiSearch,
}) => {
  const [data, setData] = useState([]);
  const [columnFilter, setColumnFilter] = useState([]);
  const [debounce] = useDebouncedValue(search, 400);

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const cellValue = String(row.getValue(columnId)).toLowerCase();
    const searchValue = value.trim().toLowerCase();
    const isUrl = cellValue.startsWith('http') || cellValue.startsWith('www');
    const isNumber = !isNaN(cellValue);
    if (isUrl) {
      addMeta({
        passed: false,
      });
      return false;
    }
    if (isNumber) {
      const passed = cellValue.startsWith(searchValue);
      addMeta({
        passed,
      });
      return passed;
    }
    const passed = cellValue.includes(searchValue);
    addMeta({
      passed,
    });
    return passed;
  };

  useEffect(() => {
    setData([...rowData]);
  }, [rowData]);

  const table = useReactTable({
    data,
    columns: columnData,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter: debounce,
      sorting: sorting,
      columnFilters: columnFilter,
    },
    onColumnFiltersChange: setColumnFilter,
    onGlobalFilterChange: setSearch,
    manualSorting: apiSorting ? true : false,
    onSortingChange: setSortingValue,
    globalFilterFn: fuzzyFilter,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedRowModel: getFacetedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSortingRemoval: isSortingRemoval,
  });

  useEffect(() => {
    setFilteredData(table.getFilteredRowModel().rows.map(row => row.original));
    if(!table.getFilteredRowModel().rows.map(row => row.original).length){
      setFilteredData(rowData);
    }
  }, [table.getFilteredRowModel()]);

  useEffect(() => {
    if (rowData?.length) {
      setFilterHeader(table);
    }
  }, [rowData]);

  useEffect(() => {
    if (table.getState().columnFilter?.[0]?.id) {
      if (table.getState().sorting?.[0]?.id) {
        table.setSorting([{ id: columnFilter?.[0]?.id, desc: false }]);
      }
    }
  }, [table.getState().columnFilter?.[0]?.id]);

  if (loading) {
    return (
      <Paper mt={10}>
        <Table
          highlightOnHover
          fontSize='xs'
          mb={10}
          verticalSpacing='xs'
          style={{ ...styles }}
        >
          <Table.Tbody>
            {Array(10)
              .fill()
              .map((_, rowKey) => (
                <Table.Tr key={`row-${rowKey}`}>
                  {Array(6)
                    .fill()
                    .map((_, cellKey) => (
                      <Table.Td key={`cell-${cellKey}`}>
                        <Skeleton height={20} />
                      </Table.Td>
                    ))}
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </Paper>
    );
  }

  return (
    <>
      {!isApiSearch && table.getRowModel().rows.length ? (
        <>
          <Paper>
            <ScrollArea>
              <Table
                highlightOnHover
                mb={10}
                verticalSpacing='6px'
                style={{
                  ...styles,
                }}
              >
                <Table.Thead
                  style={{
                    backgroundColor: 'rgba(228, 237, 253, 1)',
                    fontSize: '12px',
                  }}
                >
                  {table.getHeaderGroups().map(headerGroup => (
                    <Table.Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header, index) => (
                        <Table.Th
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{
                            cursor: header.column?.getCanSort() && 'pointer',
                          }}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              onClick={
                                allowSorting
                                  ? header.column.getToggleSortingHandler()
                                  : undefined
                              }
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: ' 🔼',
                                desc: ' 🔽',
                              }[header.column.getIsSorted()] ?? null}
                            </div>
                          )}
                        </Table.Th>
                      ))}
                    </Table.Tr>
                  ))}
                </Table.Thead>
                <Table.Tbody style={{ fontSize: '12px' }}>
                  {table.getRowModel().rows.map(row => (
                    <Table.Tr
                      style={{
                        cursor:
                      typeof onRowClick === 'function' ? 'pointer' : 'default',
                        position: 'relative',
                        background: (row?.original?.reload_type === 'express' ? COLORS.red(10) : row?.original?.is_withheld == 1 ? COLORS.warning.tableWarn : null),
                      }}
                      key={row.id}
                    >
                      {row.getVisibleCells().map(cell => (
                        <Table.Td
                          key={cell.id}
                          onClick={event => {
                            typeof onRowClick === 'function' &&
                          cell?.column?.id?.split('-')?.[1] != 'action' &&
                          (onRowClick(row?.original), event.stopPropagation());
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Table.Td>
                      ))}
                      {row?.original?.reload_type === 'express' ? <><div style={{ ...classes.expressContainer }}></div><div style={{ ...classes.expressInner }}>EXP CRR</div></> : null}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Paper>
          <Box
            mt='md'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 12px 12px 12px',
            }}
          >
            {useApiPagination ? (
              <>
                {totalNoOfPages ? (
                  <>
                    <Box>
                      <Box
                        style={{ display: 'flex', gap: 10, alignItems: 'center' }}
                      >
                        <Text size='xs' style={{ color: 'rgb(0,0,0,0.5)' }}>
                          <strong>{`Showing Page ${page} - ${totalNoOfPages}`}</strong>
                        </Text>
                        {/* {totalNoOfRecords > 10 ?
                                            <Select
                                                menuPlacement="top"
                                                options={no_of_records}
                                                onChange={(e) => { table.setPageSize(e.value); setRowLength(e); }}
                                                value={rowLength}
                                                styles={{
                                                    menu: (provided) => ({ ...provided, zIndex: 9999, padding: '0' }),
                                                    option: (provided) => ({
                                                        ...provided,
                                                        fontSize: "10px",
                                                        padding: "5px 10px 5px 10px",
                                                    }),
                                                    control: (provided) => ({
                                                        ...provided,
                                                        padding: 0,
                                                        fontSize: "10px",
                                                        maxHeight: 10,
                                                    }),
                                                }}
                                            /> : null
                                        } */}
                      </Box>
                    </Box>
                    <Box style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      {page != 1 && (
                        <ActionIcon
                          variant='light'
                          color='blue.1'
                          onClick={() => setPage(1)}
                        >
                          <IconChevronsLeft size={16} color={'gray'} />
                        </ActionIcon>
                      )}
                      {page != 1 && (
                        <ActionIcon
                          variant='light'
                          color='blue.1'
                          onClick={() => setPage(page - 1)}
                        >
                          <Text size='xs' style={{ color: 'rgb(0,0,0,0.5)' }}>
                            {page - 1}
                          </Text>
                        </ActionIcon>
                      )}
                      {page >= 1 && (
                        <ActionIcon variant='light'>
                          <Text size='xs' style={{ color: 'rgb(0,0,0,0.5)' }}>
                            {page}
                          </Text>
                        </ActionIcon>
                      )}
                      {totalNoOfPages != 1 && totalNoOfPages != page && (
                        <ActionIcon
                          variant='light'
                          color='blue.1'
                          onClick={() => setPage(page + 1)}
                        >
                          <Text size='xs' style={{ color: 'rgb(0,0,0,0.5)' }}>
                            {page + 1}
                          </Text>
                        </ActionIcon>
                      )}
                      {totalNoOfPages != 1 && totalNoOfPages != page && (
                        <ActionIcon
                          variant='light'
                          color='blue.1'
                          onClick={() => setPage(totalNoOfPages)}
                        >
                          <IconChevronsRight size={16} color='gray' />
                        </ActionIcon>
                      )}
                      {totalNoOfRecords ? (
                        <Box>
                          <Text size='xs' style={{ color: 'rgb(0,0,0,0.5)' }}>
                            {totalNoOfRecords} {totalNoOfRecords == 1 ? 'Record' : 'Records'}
                          </Text>
                        </Box>
                      ) : null}
                    </Box>
                  </>
                ) : null}
              </>
            ) : (
              <>
                <Box>
                  <Text size='xs' style={{ color: 'rgb(0,0,0,0.5)' }}>
                    <strong>{`Showing Page ${table.getState().pagination.pageIndex + 1
                    } - ${table.getPageCount()}`}</strong>
                  </Text>
                </Box>
                <Box style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {table.getState().pagination.pageIndex != 0 && (
                    <ActionIcon
                      variant='light'
                      color='blue.1'
                      onClick={() => table.setPageIndex(0)}
                    >
                      <IconChevronsLeft size={16} color='gray' />
                    </ActionIcon>
                  )}
                  {table.getState().pagination.pageIndex != 0 && (
                    <ActionIcon
                      variant='light'
                      color='blue.1'
                      onClick={() => table.previousPage()}
                    >
                      <Text size='xs' style={{ color: 'rgb(0,0,0,0.5)' }}>
                        {table.getState().pagination.pageIndex}
                      </Text>
                    </ActionIcon>
                  )}
                  {table.getState().pagination.pageIndex >= 0 && (
                    <ActionIcon variant='light' color='blue'>
                      <Text size='xs' style={{ color: 'rgb(0,0,0,0.5)' }}>
                        {table.getState().pagination.pageIndex + 1}
                      </Text>
                    </ActionIcon>
                  )}
                  {table.getPageCount() != 0 &&
                table.getPageCount() !=
                table.getState().pagination.pageIndex + 1 && (
                  <ActionIcon
                      variant='light'
                      color='blue.1'
                      onClick={() => table.nextPage()}
                    >
                      <Text size='xs' style={{ color: 'rgb(0,0,0,0.5)' }}>
                      {table.getState().pagination.pageIndex + 2}
                    </Text>
                    </ActionIcon>
                  )}
                  {table.getPageCount() != 0 &&
                table.getPageCount() !=
                table.getState().pagination.pageIndex + 1 && (
                  <ActionIcon
                      variant='light'
                      color='blue.1'
                      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    >
                      <IconChevronsRight size={16} color='gray' />
                    </ActionIcon>
                  )}
                  {data?.length ? (
                    <Box>
                      <Text size='xs' style={{ color: 'rgb(0,0,0,0.5)' }}>
                        {table.getPrePaginationRowModel().rows.length} {table.getPrePaginationRowModel().rows.length == 1 ? 'Record' : 'Records'}
                      </Text>
                    </Box>
                  ) : null}
                </Box>
              </>
            )}
          </Box>
        </>
      ): <Box
        mt="md"
        p="xl"
        style={{
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 10,
          height: '60vh',
        }}
      >
        <Image
          src="https://i.imgur.com/A6KRQAV.png"
          w={150}
          h={100}
          radius="md"
        />
        <Box>
          <Text>{noDataText}</Text>
          <Text size="sm" sx={{ color: 'rgb(0,0,0,0.4)' }}>
            {noDataSubText}
          </Text>
        </Box>
      </Box>}
    </>
  );
};

export default ReactTable;
