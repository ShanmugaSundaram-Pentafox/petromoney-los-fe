import React from "react";
import styled from "styled-components";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import BreadCrumbs from "../../components/CommonComponents/BreadCrumbs/BreadCrumbs";
import InfoCard from "../../components/CommonComponents/Cards/InfoCard";
import SectionTitle from "../../components/CommonComponents/HPCL/SectionTitle";

const AddDealerFormWrapper = styled.div`
    padding: 16px;

    .section-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;

        p {
            margin-bottom: 0px;

            &.title {
                color: #222444; 
                font-size: 20px;
                font-weight: bold;
                line-height: 29px;
            }
            &.txt {
                color: #444444;
                font-size: 16px;
                line-height: 140%;
                margin-top: 10px;
            }
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    btnWrapper: {
        display: 'flex'
    },
    addDealerButton: {
        fontSize: '16px',
        backgroundColor: '#2CAE66',
        borderColor: '#2CAE66',
        boxShadow: 'none',
        marginRight: '12px',

        '&:hover': {
            backgroundColor: '#2CAE66',
            borderColor: '#2CAE66',
            boxShadow: 'none'   
        }
    }
}));

const AddDealerForm = () => {
    const classes = useStyles();

    return (
        <AddDealerFormWrapper>
            <BreadCrumbs />

            <SectionTitle 
                title={"Information"}
            />
            
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <InfoCard 
                        title={"Dealer Info"}
                        userInitial={"S"}
                        name={"Sasikumar"}
                        description={"+91 95006 - 30513"}
                    />
                </Grid>

                <Grid item xs={4}>
                    <InfoCard 
                        title={"Dealership Info"}
                        userInitial={"S"}
                        name={"Sri Vetri Agencies"}
                        caption={"PM5215131513"}
                    />
                </Grid>

                <Grid item xs={4}>
                    <InfoCard 
                        title={"Sales Info"}
                        userInitial={"v"}
                        name={"Vetrimaran"}
                        description={"Chennai - Egmore"}
                    />
                </Grid>
            </Grid>

            <SectionTitle 
                title={"Add Dealar Details"}
                description={"Dealer address details and the gps location details"}
            />
        </AddDealerFormWrapper>
    );
};

export default AddDealerForm;
