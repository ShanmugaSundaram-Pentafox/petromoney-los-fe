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
import UnresolvedTable from './UnResolvedTable';
import ResolvedTable from './ResolvedTable';


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
    const [selectedTab, setSelectedTab] = useState("unresolved");
    const classes = useStyles()
    usePageTitle('Withheld loan', true)


    // const data = {
    //     resolved: [
    //         {
    //             "id": "111018",
    //             "name": "Ashwini automobiles",
    //             "region": "Chennai",
    //             "remarks": [
    //                 {
    //                     "id": "1",
    //                     "remarks": "Transporter Agreement not Signed",
    //                     "is_resolved": 1
    //                 },
    //                 {
    //                     "id": "2",
    //                     "remarks": "Fuel Credit Agreement not signed",
    //                     "is_resolved": 1
    //                 },
    //                 {
    //                     "id": "3",
    //                     "remarks": "Renewal Processing fee is not collected",
    //                     "is_resolved": 1
    //                 }
    //             ]
    //         },
    //         {
    //             "id": "111019",
    //             "name": "Pentafox transports",
    //             "region": "Madurai",
    //             "remarks": [
    //                 {
    //                     "id": "1",
    //                     "remarks": "Transporter Agreement not Signed",
    //                     "is_resolved": 1
    //                 },
    //                 {
    //                     "id": "2",
    //                     "remarks": "Fuel Credit Agreement not signed",
    //                     "is_resolved": 1
    //                 },
    //                 {
    //                     "id": "3",
    //                     "remarks": "Renewal Processing fee is not collected",
    //                     "is_resolved": 1
    //                 }
    //             ]
    //         }
    //     ],
    //     unresolved: [
    //         {
    //             "id": "111020",
    //             "name": "New automobiles",
    //             "region": "Chennai",
    //             "remarks": [
    //                 {
    //                     "id": "1",
    //                     "remarks": "Transporter Agreement not Signed",
    //                     "is_resolved": 0
    //                 },
    //                 {
    //                     "id": "2",
    //                     "remarks": "Fuel Credit Agreement not signed",
    //                     "is_resolved": 0
    //                 },
    //                 {
    //                     "id": "3",
    //                     "remarks": "Renewal Processing fee is not collected",
    //                     "is_resolved": 0
    //                 }
    //             ]
    //         },
    //         {
    //             "id": "111021",
    //             "name": "Pentafox",
    //             "region": "Madurai",
    //             "remarks": [
    //                 {
    //                     "id": "1",
    //                     "remarks": "Transporter Agreement not Signed",
    //                     "is_resolved": 0
    //                 },
    //                 {
    //                     "id": "2",
    //                     "remarks": "Fuel Credit Agreement not signed",
    //                     "is_resolved": 0
    //                 },
    //                 {
    //                     "id": "3",
    //                     "remarks": "Renewal Processing fee is not collected",
    //                     "is_resolved": 0
    //                 }
    //             ]
    //         }
    //     ]
    // }

    useMount(() => {
        getAllWithheldLoans()
            .then((data) => {
                setResolvedData(data.resolved)
                setUnresolvedData(data.unresolved)
            })
            .catch((e) => {
                setLoading(false)
                console.log(e);
            })

    })


    return (
        <>
            <PaperWrapper>
                <Box borderRadius={4} bgcolor="background.paper">
                    <Grid container>
                        <Grid onClick={() => { setSelectedTab("unresolved") }} style={{ textAlign: 'center', padding: 16, borderRight: '1px dashed gray' }} className={selectedTab === "unresolved" ? 'active' : ' '} item md={6}>
                            <div>Unresolved</div>
                        </Grid>
                        <Grid onClick={() => { setSelectedTab("resolved") }} className={selectedTab === "resolved" ? 'active' : ' '} style={{ textAlign: 'center', padding: 16 }} item md={6}>
                            <div>Resolved</div>
                        </Grid>
                    </Grid>
                </Box>
            </PaperWrapper>
            {
                selectedTab === "unresolved" ? <UnresolvedTable data={unresolvedData} /> : <ResolvedTable data={resolvedData} />
            }
        </>
    )
}
export default BlacklistTable;