import React from "react";
import styled from "styled-components";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import BreadCrumbs from "../../components/CommonComponents/BreadCrumbs/BreadCrumbs";
import SectionTitle from "../../components/CommonComponents/HPCL/SectionTitle";
import EnquiryInfoCard, { EnquiryInfoCardWrapper } from "../../components/CommonComponents/Cards/EnquiryInfoCard";
import { InfoBoxStyle } from "../../theme/styled-components/utils";

const HPCLWrapper = styled.div`
    padding: 16px;

    ${EnquiryInfoCardWrapper}, ${InfoBoxStyle} {
        padding: 24px 60px;
    }

    ${EnquiryInfoCardWrapper} {
        ul li {
            margin-bottom: 0;
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

        '&:hover': {
            backgroundColor: '#2CAE66',
            borderColor: '#2CAE66',
            boxShadow: 'none'   
        }
    }
}));

const HPCL = () => {
    const classes = useStyles();

    return (
        <HPCLWrapper>
            <BreadCrumbs />

            <SectionTitle 
                title={"HPCL Referral page"}
                renderRightElement={
                    <div className={classes.btnWrapper}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            className={classes.addDealerButton}
                            endIcon={<AddIcon />}
                        >
                            Add a dealer
                        </Button>
                    </div>
                }
            />

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <EnquiryInfoCard 
                        listData={[
                            {'title': 'Dealership name', 'description': 'Sri velraj Agencies'},
                            {'title': 'Dealership ID', 'description': '5122422554'}
                        ]}
                    />
                </Grid>
                <Grid item xs={6}>
                    <EnquiryInfoCard 
                        listData={[
                            {'title': 'Dealer name', 'description': 'Sasikumar palanisamy'},
                            {'title': 'Dealer Phone NO', 'description': '9545621578'}
                        ]}
                    />
                </Grid>
                <Grid item xs={6}>
                    <EnquiryInfoCard 
                        listData={[
                            {'title': 'Referral date', 'description': '23 Nov, 2020'},
                            {'title': 'Sales area/Region', 'description': 'Chennai - Egmore'}
                        ]}
                    />
                </Grid>
                <Grid item xs={6}>
                    <EnquiryInfoCard 
                        listData={[
                            {'title': 'Regional manager name', 'description': 'Raj kumar'},
                            {'title': 'Sales area/Region', 'description': 'Rahul gandhi'}
                        ]}
                    />
                </Grid>
                <Grid item xs={12}>
                    <InfoBoxStyle titleMarginBottom={12}>
                        <p className="title">Remarks</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pharetra elementum phasellus nec, praesent morbi eu fusce<br /> sed. Lectus tempor proin sem odio porttitor pretium. Lorem consequat leo, nunc tincidunt.</p>
                    </InfoBoxStyle>
                </Grid>
            </Grid>
        </HPCLWrapper>
    );
};

export default HPCL;
