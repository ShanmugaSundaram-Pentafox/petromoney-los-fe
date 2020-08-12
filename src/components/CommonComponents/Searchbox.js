import React from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";
import SearchIcon from '@material-ui/icons/Search';


const SearchboxWrapper = styled.div`
    position: relative;
    width: 24%;
    margin-right: 32px;

    .search-icon-wrapper {
        position: absolute;
        top: 0;
        right: 0;
        /* color: #000000; */
        background-color: #FFFFFF;
        border: solid #DDDDDD;
        border-width: 1px 1px 1px 0;
        width: 48px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;
        z-index: 1;
        cursor: pointer;
        
        .search-icon {
            margin-right: 4px;
        }
    }

    .form-control {
        display: block;
        width: 80%;
        font-size: 14px;
        line-height: 17px;
        padding: 12px 56px 12px 12px;
        height: 40px;
        color: #000000;
        background-color: #FFFFFF;
        border: 1px solid #ddd;
        border-radius: 50px;
        transition: all .4s ease;
        margin-left: auto;

        &:focus {
            width: 100%;
            outline: 0 none;
        }

        &::place-holder {
            color: #495057;
        }
    }
`;

export const Searchbox = () => {
    return (
        <SearchboxWrapper>
            <span className="search-icon-wrapper">
                <SearchIcon className="search-icon" />
            </span>

            <input placeholder="Search..." type="text" className="form-control" />
        </SearchboxWrapper>
    );
};

Searchbox.propTypes = {
};

export default Searchbox;

