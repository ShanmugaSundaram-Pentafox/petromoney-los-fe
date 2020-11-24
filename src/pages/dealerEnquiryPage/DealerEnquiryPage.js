import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import PhonelinkRingIcon from '@material-ui/icons/PhonelinkRing';
import SendIcon from '@material-ui/icons/Send';

import DealerEnquiryInfoCard from "../../components/CommonComponents/Dealer/DealerEnquiryInfoCard";
import PhotoCard from "../../components/CommonComponents/Dealer/PhotoCard";
import BreadCrumbs from "../../components/CommonComponents/BreadCrumbs/BreadCrumbs";
import { InfoBoxStyle } from "../../theme/styled-components/utils";
import { DealerInfo } from "../../components/CommonComponents/Dealer/DealerInfoCard";
import { DealerEnquiryUserInfoWrapper, DealerEnquiryPageWrapper } from "./dealerenquirypage.styles";

const photoData = [
    "https://bit.ly/2SB6BEy",
    "https://pyt-images.imgix.net/images/web_app/speed-boat/sidebar/bg1.jpg",
    "https://pyt-images.imgix.net/images/web_app/speed-boat/sidebar/bg2.jpg",
    "https://pyt-images.imgix.net/images/web_app/speed-boat/sidebar/bg3.jpg",
    "https://pyt-images.imgix.net/images/web_app/speed-boat/sidebar/bg4.jpg",
    "https://pyt-images.imgix.net/images/web_app/speed-boat/sidebar/bg5.jpg",
    "https://pyt-images.imgix.net/images/web_app/speed-boat/sidebar/bg6.jpg"
];

const useStyles = makeStyles((theme) => ({
    btnWrapper: {
        display: 'flex'
    },

    editButtonStyle: {
        color: '#4770C1',
        fontSize: '16px',
        borderColor: '#4770C1'
    },

    editIconStyle: {
        fontSize: '16px',
        color: '#4770C1',
        marginRight: '6px',
        marginBottom: '2px'
    },

    acceptButton: {
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
    },
    rejectButton: {
        fontSize: '16px',
        backgroundColor: '#F05454',
        borderColor: '#F05454',
        boxShadow: 'none',
        
        '&:hover': {
            backgroundColor: '#F05454',
            borderColor: '#F05454',
            boxShadow: 'none'
        }
    },
    userInfoDetailsIconStyle: {
        fontSize: '20px',
        color: '#4770C1',
        position: 'absolute',
        top: '0',
        left: '6px'
    },
    sendIconStyle: {
        transform: 'rotate(-28deg)'
    }
}));

const DealerEnquiryPage = () => {
    const classes = useStyles();

    return (
        <DealerEnquiryPageWrapper>
            <BreadCrumbs />

            <div className="section-title">
                <span>
                    <b>View User</b>

                    <Button 
                        variant="outlined" 
                        size="medium" 
                        color="primary" 
                        className={classes.editButtonStyle}
                    >
                        <EditIcon className={classes.editIconStyle} />
                        Edit
                    </Button>
                </span>

                <div className={classes.btnWrapper}>
                    <Button variant="contained" color="primary" className={classes.acceptButton}>Accept</Button>
                    <Button variant="contained" color="secondary" className={classes.rejectButton}>Reject</Button>
                </div>
            </div>
            
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <DealerEnquiryUserInfoWrapper>
                        <div className="user-info-details">
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <DealerInfo 
                                        userInitial={"s"}
                                        name={"Sri Saravana Agencies"}
                                        description={"Sasikumar Palanisamy"}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <div className="icon-txt">
                                        <PhonelinkRingIcon className={classes.userInfoDetailsIconStyle}/>
                                        +91 - 9585262611
                                    </div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div className="icon-txt">
                                        <SendIcon 
                                            className={clsx(classes.userInfoDetailsIconStyle, classes.sendIconStyle)}
                                        />
                                        No.5, Nethaji Street, Lakshmi
                                        Nagar, Valasarakkam, Tamil Nadu,
                                        Chennai - 600058
                                    </div>
                                </Grid>
                                <Grid item xs={2}>
                                    <div className="icon-txt text-center">
                                        Dealer Interest:
                                        <span className="pill">Outrage</span>
                                    </div>
                                </Grid>
                            </Grid>

                        </div>
                        <div>
                            <DealerEnquiryInfoCard 
                                listData={[
                                    {'title': 'Manager Name:', 'description': 'M Saravanan'},
                                    {'title': 'Manager Phone No:', 'description': '+91 - 9585262611'},
                                    {'title': 'GST IN:', 'description': '33AOWBVSJNBCBN3'},
                                    {'title': 'GPS Location:', 'description': ''}
                                ]}
                            />
                            <DealerEnquiryInfoCard 
                                listData={[
                                    {'title': 'Electricity service No:', 'description': '513521513'},
                                    {'title': 'Electricity Charge Per Month:', 'description': 'Rs.150000'},
                                    {'title': 'Electricity Operator / Provider:', 'description': 'TNEB'},
                                    {'title': 'Netmeter Instruction to Dealer:', 'description': 'Yes'}
                                ]}
                            />
                            <DealerEnquiryInfoCard 
                                title={"Building details"}
                                listData={[
                                    {'title': 'Office room terrace area:', 'description': '651 sq.ft'},
                                    {'title': 'Available Area in Terrace.Sqmtr:', 'description': '1256 sq.ft'},
                                    {'title': 'Type of roof:', 'description': 'Concrete'},
                                    {'title': 'Additional space for rooftop.Sqmtr:', 'description': '1522 sq.ft'}
                                ]}
                            />
                            <DealerEnquiryInfoCard 
                                title={"Power details"}
                                listData={[
                                    {'title': 'Capacity required KWP:', 'description': '65 KW'},
                                    {'title': 'Feasible capacity KWP:', 'description': '45 KW'},
                                    {'title': 'Incoming supply-phase:', 'description': '55 KW'},
                                    {'title': 'Voltage quality remarks:', 'description': 'Good'}
                                ]}
                            />
                        </div>
                    </DealerEnquiryUserInfoWrapper>
                </Grid>
                <Grid item xs={6}>
                    <DealerEnquiryInfoCard 
                        title={"Building details"}
                        listData={[
                            {'title': 'Office room terrace area:', 'description': '651 sq.ft'},
                            {'title': 'Available Area in Terrace.Sqmtr:', 'description': '1256 sq.ft'},
                            {'title': 'Type of roof:', 'description': 'Concrete'},
                            {'title': 'Additional space for rooftop.Sqmtr:', 'description': '1522 sq.ft'}
                        ]}
                    />
                </Grid>
                <Grid item xs={6}>
                    <DealerEnquiryInfoCard 
                        title={"Power details"}
                        listData={[
                            {'title': 'Capacity required KWP:', 'description': '65 KW'},
                            {'title': 'Feasible capacity KWP:', 'description': '45 KW'},
                            {'title': 'Incoming supply-phase:', 'description': '55 KW'},
                            {'title': 'Voltage quality remarks:', 'description': 'Good'}
                        ]}
                    />
                </Grid>

                <Grid item xs={6}>
                    <PhotoCard 
                        title={"Photos of office building with direction indicator"}
                        photos={photoData} 
                    />
                </Grid>
                <Grid item xs={6}>
                    <PhotoCard 
                        title={"Photos of office building with direction indicator"}
                        photos={photoData} 
                    />
                </Grid>
                <Grid item xs={12}>
                    <InfoBoxStyle titleMarginBottom={16}>
                        <p className="title">Remarks</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pharetra elementum phasellus nec, praesent morbi eu fusce sed. Lectus tempor proin sem odio porttitor pretium. Lorem consequat leo, nunc tincidunt. Dui adipiscing morbi vitae arcu arcu dolor lacus, iaculis. Ultricies sit hac mi scelerisque quam a adipiscing velit quis. Ut euismod sagittis sit mattis. In lorem consequat ut turpis quis. Viverra lobortis bibendum purus integer. Massa sem dui sagittis, aliquet. Imperdiet sed in facilisis lectus. Consequat, eget et, condimentum molestie diam cras dolor. In phasellus nisl sagittis, enim ultrices.</p>
                    </InfoBoxStyle>
                </Grid>
            </Grid>
        </DealerEnquiryPageWrapper>
    );
};

export default DealerEnquiryPage;
