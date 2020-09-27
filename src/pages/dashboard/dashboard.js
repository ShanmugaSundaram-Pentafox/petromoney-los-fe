import React, { useState } from 'react';
import _countBy from 'lodash/countBy'
import LoansTable from './components/LoansTable';
import usePageTitle from '../../hooks/usePageTitle';
import { InfoBoxContainer, InfoBoxWrapper } from '../../components/CommonComponents/InfoBox';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { Tooltip, LabelList,Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
import { useMount } from 'react-use';
import { getAllLoans } from '../../services/loans.service';

const LoansNewTableContainer = styled.div`
  display: flex;
  padding: 12px;
`;

const LoansNewTableWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  width: 50%;
  margin: 0 12px;

  .title {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.33;
    margin-bottom: 16px;
  }
`;

const LoansNewTable = styled.div`
  width: 100%;
  height: 352px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 6px -6px rgba(0,0,0,0.12);
  overflow: hidden;
  overflow-y: scroll;

  .table-content {
    display: flex;
    align-items: center;
    padding: 16px 8px;
    cursor: pointer;

    &:hover {
      background-color: #F7F7F7;
    }

    .content {
      display: flex;
      width: 30%;
      padding: 0 12px;

      &.center {
        justify-content: center;
      }

      &:first-child {
        width: 40%;
      }
    }

    p {
      color: #504E58;
      font-size: 12px;
      line-height: 15px;
      font-weight: 400;
      margin-bottom: 0;

      span {
        display: block;
        color: #000000;
        font-size: 13px;
        line-height: 15px;
        font-weight: 400;
        margin-bottom: 4px;
      }
    }

    .table-pill {
      background-color: #e1f8e5;
      display: inline-block;
      color: #51b37f;
      border-radius: 29px;
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 600;
      min-width: 80px;
      text-align: center;

      &.red {
        color: #d35178;
        background-color: #f7eae8;
      }
    }

    .price-txt {
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
      margin-left: auto;
    }
  }
`;

const Dashboard = ({ currentUser }) => {
  usePageTitle('Dashboard');
  const [chartData, setChartData] = useState([]);
  useMount(() => {
    getAllLoans()
      .then(res => {
        const data = _countBy(res, item => {
          return item.status.toLowerCase()
        });
        let cdata = [
          { name: 'Submitted', count: data.submitted },
          { name: 'Req for Appr', count: data.loan_approval || 0 },
          { name: 'Req for Disb', count: data.disbursement_approval || 0 },
          { name: 'Approved', count: data.approved },
          { name: 'Rejected', count: data.rejected },
          { name: 'Disbursed', count: data.disbursed },
        ];
        setChartData(cdata);
      })
      .catch(err => {

      })
  });
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <InfoBoxContainer>
            {
              chartData.length ? (
                <InfoBoxWrapper>
                  <p>Loans</p>
                  <BarChart
                    width={540}
                    height={260}
                    data={chartData}
                    label
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    {/* <Legend dataKey="name" /> */}
                    <Bar dataKey="count" fill="#ec6e30">
                      <LabelList position="top" />
                    </Bar>
                    {/* <Bar width={20} dataKey="count" fill="#82ca9d" />
                    <Bar width={20} dataKey="count" fill="#f4a853" />
                    <Bar width={20} dataKey="count" fill="#19a474" />
                    <Bar width={20} dataKey="count" fill="#e66023" /> */}
                  </BarChart>
                </InfoBoxWrapper>
              ) : null
            }
          </InfoBoxContainer>
        </Grid>
      </Grid>

        {/* <InfoBoxWrapper width={"260px"}>
          <InfoBox number={100} title={"Submitted"} text={"Lorem Ipsum"} />
          <InfoBox number={100} title={"Approved/Rejected"} text={"Lorem Ipsum"} />
        </InfoBoxWrapper>
        <InfoBoxWrapper width={"260px"}>
          <InfoBox number={100} title={"Disbursed"} text={"Lorem Ipsum"} />
          <InfoBox number={0} title={"Lorem Ipsum"} text={"Inprogress"} />
        </InfoBoxWrapper> */}

      {/* New table code start */}
      {/* <LoansNewTableContainer>        
        <LoansNewTableWrapper>
          <div class="title">Submitted</div>
          <LoansNewTable>
            <div className="table-content">
              <div class="content">
                <p>
                  <span>Lorem Ipsum</span>
                  Lorem Ipsum Lorem Ipsum 
                </p>
              </div> 

              <div class="content center">
                <span className="table-pill">Paid</span>
              </div>  
              
              <div class="content">
                <span className="price-txt">₹5,000,000</span>
              </div>
            </div>
            <div className="table-content">
              <div class="content">
                <p>
                  <span>Lorem Ipsum</span>
                  Lorem Ipsum Lorem Ipsum 
                </p>
              </div> 

              <div class="content center">
                <span className="table-pill">Paid</span>
              </div>  
              
              <div class="content">
                <span className="price-txt">₹5,000,000</span>
              </div>
            </div>
            <div className="table-content">
              <div class="content">
                <p>
                  <span>Lorem Ipsum</span>
                  Lorem Ipsum Lorem Ipsum 
                </p>
              </div> 

              <div class="content center">
                <span className="table-pill red">Late</span>
              </div>  
              
              <div class="content">
                <span className="price-txt">₹5,000,000</span>
              </div>
            </div>
            <div className="table-content">
              <div class="content">
                <p>
                  <span>Lorem Ipsum</span>
                  Lorem Ipsum Lorem Ipsum 
                </p>
              </div> 

              <div class="content center">
                <span className="table-pill">Paid</span>
              </div>  
              
              <div class="content">
                <span className="price-txt">₹5,000,000</span>
              </div>
            </div>
            <div className="table-content">
              <div class="content">
                <p>
                  <span>Lorem Ipsum</span>
                  Lorem Ipsum Lorem Ipsum 
                </p>
              </div> 

              <div class="content center">
                <span className="table-pill">Paid</span>
              </div>  
              
              <div class="content">
                <span className="price-txt">₹5,000,000</span>
              </div>
            </div>
          </LoansNewTable>
        </LoansNewTableWrapper>  
      </LoansNewTableContainer>  
       */}
      {/* New table code end */}


      <LoansTable currentUser={currentUser} />
    </div>
  );
}

export default Dashboard;