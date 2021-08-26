import React, { useMemo, useState } from 'react';
import { makeStyles } from "@material-ui/styles";
import { useMount } from 'react-use';
import { Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Paper } from "@material-ui/core"; import Button from '../../components/CommonComponents/Button/Button';
import { DeleteOutlineRounded } from '@material-ui/icons';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { Tooltip } from '@material-ui/core';
import { Drawer } from "@material-ui/core";
import { green } from '@material-ui/core/colors';
import usePageTitle from '../../hooks/usePageTitle';
import AddBlackListForm from './AddBlackListForm';
import styled from 'styled-components';
import { Box } from '@material-ui/core';
import { getAllWithheldLoans } from '../../services/withheld.services';


const PaperWrapper = styled.div`

margin-bottom:10px;
font-size:16px;
background-color: #f1f1f1;

.active {
    background-color: #f1f1f1;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
  }
`;


const useStyles = makeStyles((theme) => ({
    title: {
        fontWeight: 500,
    },
}))

const BlacklistTable = () => {
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resolvedData, setResolvedData] = useState([])
    const [unresolvedData, setUnresolvedData] = useState([])
    const [selectedTab, setSelectedTab] = useState("resolved");
    const classes = useStyles()
    usePageTitle('Withheld loan', true)


    // const data = [
    //     {
    //         "dealership_id": "111018",
    //         "name": "Ashwini automobiles",
    //         "region": "Chennai",
    //         "remarks": [
    //             {
    //                 "id": "1",
    //                 "remarks": "Transporter Agreement not Signed",
    //                 "is_resolved": 0
    //             },
    //             {
    //                 "id": "2",
    //                 "remarks": "Fuel Credit Agreement not signed",
    //                 "is_resolved": 1
    //             },
    //             {
    //                 "id": "3",
    //                 "remarks": "Renewal Processing fee is not collected",
    //                 "is_resolved": 1
    //             }
    //         ]
    //     },
    //     {
    //         "dealership_id": "111019",
    //         "name": "Pentafox transports",
    //         "region": "Madurai",
    //         "remarks": [
    //             {
    //                 "id": "1",
    //                 "remarks": "Transporter Agreement not Signed",
    //                 "is_resolved": 0
    //             },
    //             {
    //                 "id": "2",
    //                 "remarks": "Fuel Credit Agreement not signed",
    //                 "is_resolved": 1
    //             },
    //             {
    //                 "id": "3",
    //                 "remarks": "Renewal Processing fee is not collected",
    //                 "is_resolved": 1
    //             },
    //             {
    //                 "id": "4",
    //                 "remarks": "fee is not collected",
    //                 "is_resolved": 1
    //             },
    //             {
    //                 "id": "5",
    //                 "remarks": "Renewal Processing fee is not collected",
    //                 "is_resolved": 1
    //             }
    //         ]
    //     },
    //     {
    //         "dealership_id": "111022",
    //         "name": "Pentafox transports",
    //         "region": "Madurai",
    //         "remarks": [
    //             {
    //                 "id": "1",
    //                 "remarks": "Transporter Agreement not Signed",
    //                 "is_resolved": 0
    //             },
    //             {
    //                 "id": "2",
    //                 "remarks": "Fuel Credit Agreement not signed",
    //                 "is_resolved": 1
    //             },
    //         ]
    //     },
    //     {
    //         "dealership_id": "111023",
    //         "name": "Pentafox transports",
    //         "region": "Madurai",
    //         "remarks": [
    //             {
    //                 "id": "1",
    //                 "remarks": "Transporter Agreement not Signed",
    //                 "is_resolved": 0
    //             },
    //         ]
    //     },
    //     {
    //         "dealership_id": "111024",
    //         "name": "Pentafox transports",
    //         "region": "Madurai",
    //         "remarks": [
    //             {
    //                 "id": "1",
    //                 "remarks": "Transporter Agreement not Signed",
    //                 "is_resolved": 0
    //             },
    //             {
    //                 "id": "2",
    //                 "remarks": "Fuel Credit Agreement not signed",
    //                 "is_resolved": 1
    //             },
    //             {
    //                 "id": "3",
    //                 "remarks": "Renewal Processing fee is not collected",
    //                 "is_resolved": 1
    //             }
    //         ]
    //     }
    // ]

    useMount(() => {
        getAllWithheldLoans()
            .then((data) => {
                console.log("dataaaaaaaa", data.resolved)
                setResolvedData(data.resolved)
                setUnresolvedData(data.unresolved)
                setLoading(false)
            })
            .catch((e) => {
                setLoading(false)
                console.log(e);
            })

    })

    const columns = useMemo(() => {
        return [
            {
                label: "ID",
                name: "id",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value) => {
                        return <div>{value}</div>
                    },
                },
            },
            {
                label: "Name",
                name: "name",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value) => {
                        return <>{value?.toUpperCase()}</>
                    },
                },
            },
            {
                label: "Region",
                name: "region",
                options: {
                    filter: false,
                    sort: true,
                },
            },
            {
                label: "Remarks",
                name: "remarks",
                options: {
                    filter: true,
                    sort: true,
                    setCellProps: () => ({
                        align: 'left',
                    }),
                    customBodyRender: (value, tableMeta) => {
                        return (
                            value.map((remark) => {
                                return (
                                    <div style={{ marginBottom: 12, display: 'flex' }}>
                                        <div style={{ minWidth: 250, maxWidth: 250 }}>{remark.remarks}</div>
                                        <div style={{ marginLeft: 12 }}>
                                            <Tooltip title="Click to resolve">
                                                <CheckOutlinedIcon style={{ color: green[200] }} fontSize={'small'} />
                                            </Tooltip>
                                        </div>
                                        <div style={{ marginLeft: 12 }}>
                                            <Tooltip title='Click to delete'>
                                                <DeleteOutlineRounded style={{ color: "#ff6666" }} fontSize={'small'} />
                                            </Tooltip>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    },
                },
            },
        ]
    }, [])
    const options = {
        // filterType: 'checkbox',
        selectableRowsHeader: false,
        selectableRows: "none",
        rowsPerPage: 10,
        viewColumns: false,
        print: false,
        download: false,
        filter: false,
        isRowSelectable: () => false,
        customToolbar: () => {
            return (
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => setOpenModal(true)}
                >
                    Add
                </Button>
            );
        }

    }


    return (
        <>
            <PaperWrapper>
                <Box borderRadius={4} bgcolor="background.paper">
                    <Grid container>
                        <Grid onClick={() => { setSelectedTab("resolved") }} className={selectedTab === "resolved" ? 'active' : ' '} style={{ textAlign: 'center', padding: 16, borderRight: '1px dashed gray' }} item md={6}>
                            <div>Resolved</div>
                        </Grid>
                        <Grid onClick={() => { setSelectedTab("unresolved") }} style={{ textAlign: 'center', padding: 16 }} className={selectedTab === "unresolved" ? 'active' : ' '} item md={6}>
                            <div>Unresolved</div>
                        </Grid>
                    </Grid>
                </Box>
            </PaperWrapper>
            <Grid item md={12}>
                {Array.isArray(resolvedData) && resolvedData.length ? (
                    <MUIDataTable
                        title={
                            <Typography className={classes.title} variant="h5" component="h5">
                                Withheld Loans
                            </Typography>
                        }
                        data={selectedTab === "resolved" ? resolvedData : unresolvedData}
                        columns={columns}
                        options={options}
                    />
                ) : (!loading && <Paper style={{ padding: 10 }}>No withheld loans found</Paper>)
                }
                {
                    loading && <div style={{ textAlign: 'center' }}> <CircularProgress /></div>
                }
            </Grid>
            <Drawer
                anchor="right"
                open={openModal}
                onClose={() => setOpenModal(false)}
                variant="temporary"
            >
                <AddBlackListForm callback={() => setOpenModal(false)} data={resolvedData} />

            </Drawer>
        </>
    )
}
export default BlacklistTable;