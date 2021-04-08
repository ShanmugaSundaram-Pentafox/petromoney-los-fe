import styled from "styled-components";
import { xs, sm, md } from '../../theme/styled-components/device';

export const LoginWrapper = styled.div`
    position: relative;
    display: flex;

    aside {
        width: 50%;
        padding: 56px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        z-index: 1;

        ${xs} {
            display: none;
        }
        ${md} {
            padding: 80px;
        }

        img {
            display: block;
            height: 120px;
            margin: 0 0 32px auto;

            ${md} {
                height: 168px;
                margin-bottom: 40px;
            }
        }

        h1 {
            max-width: 368px;
            color: #FFFFFF;
            font-size: 34px;
            font-weight: bold;
            line-height: 120%;
            text-transform: capitalize;
            text-align: right;
            margin: 0;
            margin-left: auto;

            ${md} {
                font-size: 50px;
            }

            span {
                display: block;
                font-size: 20px;
                line-height: 150%;
                margin-bottom: 2px;

                ${md} {
                    font-size: 30px;
                }
            }
        }
    }

    .right-content {
        width: 100%;
        padding: 32px 16px;
        height: 100vh;
        background-color: #FFFFFF;
        overflow: hidden scroll;
        
        ${sm} {
            width: 50%;
            padding: 128px 32px;
            margin-left: auto;
        }
        ${md} {
            padding: 192px 64px 128px;
        }

        .mbl-img {
            display: block;
            margin: 0 auto 64px;

            ${sm} {
                display: none;
            }
        }

        .section-title {
            color: #585A5A;
            font-size: 20px;
            line-height: 29px;
            margin-bottom: 40px;

            span {
                display: block;
                color: #000000;
                font-weight: 500;
                font-size: 22px;
                line-height: 32px;
                margin-bottom: 8px;
            }
        }
    }
`;
