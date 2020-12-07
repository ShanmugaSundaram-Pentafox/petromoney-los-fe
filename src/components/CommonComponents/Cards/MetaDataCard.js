import React from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";
import { makeStyles } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import CachedIcon from '@material-ui/icons/Cached';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';

export const MetaDataCardWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px;
    background-color: #FFFFFF;
    border-radius: 4px;
    min-height: 120px;
    margin-bottom: 24px;
    transition: all .5s ease;

    &:hover {
        box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.1);
    }

    .text {
        flex: 1;
        color: #000000;
        font-size: 18px;
        font-weight: 600;
        line-height: 140%;
    }

    .pill {
        display: flex;
        align-items: center;
        padding: 8px 14px 7px 16px;
        text-align: center;
        color: #FFFFFF;
        font-weight: 600;
        font-size: 15px;
        line-height: 140%;
        background-color: #2CAE66;
        border-radius: 18px;
        margin-left: 24px;

        &.inprocess {
            color: #222444;
            background-color: #FAA61A;
            padding: 8px 11px 7px 11px;

            .makeStyles-icon-17 {
                color: #222444;
            }
        }

        &.pending {
            background-color: #C68F25;
            padding: 8px 14px 7px 14px;
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    icon: {
        color: '#FFFFFF',
        fontSize: '16px',
        marginLeft: '4px'
    }
}));

const MetaDataCard = ({
    cardText= "Lorem Ipsum",
    done= false,
    inprocess= false,
    pending= false
}) => {
    const classes = useStyles();

    return (
        <MetaDataCardWrapper>
            <span className="text">{cardText}</span>
            
            {done ? <span className="pill">Done <DoneIcon className={classes.icon} /></span> : null}
            {inprocess ? <span className="pill inprocess">Inprocess <CachedIcon className={classes.icon} /></span> : null}
            {pending ? <span className="pill pending">Pending <PriorityHighIcon className={classes.icon} /></span> : null}
        </MetaDataCardWrapper>
    );
};

MetaDataCard.propTypes = {
    cardText: PropTypes.string.isRequired,
    done: PropTypes.bool,
    inprocess: PropTypes.bool,
    pending: PropTypes.bool,
};

export default MetaDataCard;
