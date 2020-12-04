import React from "react"
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import {
  ChartCardContainer,
  ChartCardHeader,
  ChartWrapper,
  ChartBlock,
  ChartLabelsBlock,
  ChartLabelWrapper,
} from "./ChartCard.css";
import { CHART_COLORS } from "../../../config/constants";

const ChartLabelItem = ({
  text,
  value,
  color,
  onClick,
}) => {
  return (
    <ChartLabelWrapper color={color} onClick={onClick}>
      <div className="cc-label-value">{value}</div>
      <div className="cc-label-text">{text}</div>
    </ChartLabelWrapper>
  )
}

const ChartCard = ({ title, actionButton, labels, chartTitle, chartCaption, children }) => {
  const { label, ...buttonProps } = actionButton || {};
  return (
    <ChartCardContainer>
      <ChartCardHeader>
        <Typography variant="h4">{title}</Typography>
        {
          label && (
            <Button variant="outlined" color="primary" size="medium" {...buttonProps}>{label}</Button>
          )
        }
      </ChartCardHeader>
      <ChartWrapper>
        <ChartBlock>
          <div>{chartTitle}</div>
          <div style={{ width: '85%', margin: '0 auto' }}>{children}</div>
          <div>{chartCaption}</div>
        </ChartBlock>
        <ChartLabelsBlock vertical={Array.isArray(labels) && labels.length < 4}>
          {
            Array.isArray(labels) && labels.map((item, i) => (
              <ChartLabelItem key={i} text={item.label} value={item.value} color={item.color || CHART_COLORS[i]} onClick={item.onClick} />
            ))
          }
        </ChartLabelsBlock>
      </ChartWrapper>
    </ChartCardContainer>
  )
}

export default ChartCard
