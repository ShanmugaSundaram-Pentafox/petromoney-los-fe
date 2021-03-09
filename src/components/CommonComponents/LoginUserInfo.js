import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import styled, { css } from "styled-components";

const LoginUserInfoWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    color: #263238;
    margin-left: 32px;

    p {
        text-align: right;
        font-weight: 500;
        font-size: 14px;
        line-height: 1.2;
        margin: 0 12px 0 0;
        
        span {
            display: block;            
            font-size: 11px;
            font-weight: normal;
            line-height: 14px;
            margin-top: 2px;
        }
    }

    img {
        width: 40px;
        height: 40px;
        border-radius: 100%;
        object-fit: cover;
        cursor: pointer;
    }

    .user-initials-wrapper {
        display: flex;
        align-items: center;
        cursor: pointer;

        .user-initials {
            display: inline-block;
            font-weight: 500;
            background-color: #dddddd;
            width: 32px;
            height: 32px;
            border-radius: 100%;
            background-clip: padding-box;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 6px;
            user-select: none;
        }

        .caret {
            display: inline-block;
            width: 0;
            height: 0;
            border-top: 5px solid;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
        }
    }


    .header-dropdown {
        display: none;
        min-width: 152px;
        position: absolute;
        top: 100%;
        right: 4px;
        background: #2F2E36;
        box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.1);
        padding: 10px 0;
        margin-top: 16px;

        &:before {
            content: '';
            height: 0;
            width: 0;
            border-left: 16px solid transparent;
            border-bottom: 14px solid #333;
            position: absolute;
            bottom: 100%;
            right: 0;
        }

        span {
            color: #FFFFFF;
            font-size: 13px;
            display: block;
            padding: 10px 16px;
            transition: all .4s ease;
            cursor: pointer;

            &:hover {
                padding-left: 20px;
            }
        }
    }

    ${props => props.open && css`
        .header-dropdown {
            display: block;
        }
    `}
`;

export const LoginUserInfo = ({
    open= false,
    user,
    logout
}) => {
    const [show, setShow] = useState();
    let ref= useRef();
    useEffect(() => {
        let handler = (event)=> {
            if(!ref.current.contains(event.target)) {
                setShow(false);
            }
        }
        document.addEventListener("mousedown",handler);
        return () => {
            document.removeEventListener("mousedown",handler);
        }
    });
    return (
        <LoginUserInfoWrapper open={show} ref={ref} onClick={() => setShow(!show)}>
            <p>
            {user.name}
            {/* <span>{user.mobile}</span> */}
            </p>
            {/* user image style */}
            {/* <img src="https://i.imgur.com/JBj1jMv.png" alt="user-img" /> */}

            {/* user initials style */}
            <div className="user-initials-wrapper">
            <span className="user-initials">{user.name.charAt(0)}</span>
            <i className="caret"></i>
            </div>

            <div className="header-dropdown">
                <span onClick={logout}>Logout</span>
            </div>
        </LoginUserInfoWrapper>
    );
};

LoginUserInfo.propTypes = {
    open: PropTypes.bool
};

export default LoginUserInfo;