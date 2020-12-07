import styled from "styled-components";
import { InfoBoxStyle } from "../../../theme/styled-components/utils";
import { InfoWrapper } from "../../../components/CommonComponents/Cards/InfoCard";
import { InfoCardWrapper } from "../../../components/CommonComponents/Cards/EnquiryInfoCard";

export const UserInfoWrapper = styled(InfoBoxStyle)`
  ${InfoCardWrapper} {
    padding: 24px 0 22px;
    border-radius: 0px;
    box-shadow: none;
    margin-bottom: 0px;

    &:not(:last-child) {
      border-bottom: 1px dashed #BCBDBD;
    }
    &:last-child {
      padding-bottom: 0;
    }

    ul {

      li {
        width: 25%;
        margin-bottom: 0;
      }
    }
  }

  .user-info-details {
    /* display: flex; */
    padding-bottom: 36px;
    border-bottom: 1px dashed #BCBDBD;

    ${InfoWrapper} {
      margin-right: 48px;
    }

    .icon-txt {
      position: relative;
      color: #444444;
      font-size: 16px;
      line-height: 140%;
      padding-left: 40px;

      &.text-center {
          text-align: center;
      }

      .pill {
        color: #FFFFFF;
        display: inline-block;
        padding: 7px 16px 8px 10px;
        background-color: #2CAE66;
        border-radius: 30px;
        font-size: 13px;
        font-weight: 600;
        line-height: 17px;
        margin-top: 8px;

        &:before {
          content: '';
          display: inline-block;
          width: 11px;
          height: 11px;
          background-color: #FFFFFF;
          border-radius: 100%;
          vertical-align: -1px;
          margin-right: 8px;
        }
      }
    }
  }
`;

export const PageWrapper = styled.section`
  padding: 16px;

  .section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    span {
      display: flex;
      align-items: center;

      b {
        color: #222444; 
        font-size: 18px;
        font-weight: bold;
        line-height: 29px;
        margin-right: 24px;
      }
    }
  }
`;