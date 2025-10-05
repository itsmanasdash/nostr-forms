import styled from "styled-components";
import { Card } from "antd";

export const SectionWrapper = styled.div`
  margin-bottom: 24px;
  .section-header {
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .section-title {
    font-size: 18px;
    font-weight: 500;
    width: 100%;
    margin-bottom: 8px;
  }
  .section-title-input {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  .section-description {
    color: rgba(0, 0, 0, 0.65);
    width: 100%;
  }
  .section-content {
    margin-top: 16px;
  }
  .section-actions {
    display: flex;
    gap: 8px;
    margin-left: 16px;
  }
  .collapsed-indicator {
    margin-left: 8px;
    color: rgba(0, 0, 0, 0.45);
  }
  .drop-indicator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(24, 144, 255, 0.1);
    border: 2px dashed #1890ff;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
    pointer-events: none;
  }
`;

export const StyledCard = styled(Card)`
  position: relative;
  transition: all 0.2s;
  border-radius: 8px 8px 8px 8px !important;
  margin-top: -6px;
  z-index: 0;
  border: 0.5px dashed #000000 !important;
  background-color: rgba(255, 255, 255, 0.4) !important;
  
  .ant-card-head {
    border-bottom: none;
    background-color: transparent;
  }
  
  .ant-card-body {
    padding-top: 16px;
    background-color: transparent;
  }
`;

export const OrangeStrip = styled.div`
  height: 12px;
  background: #ff5733;
  margin-bottom: 0;
  border-radius: 0 9px 0px 0px;
  z-index: 1;
  position: relative;
`;

export const SectionLabel = styled.div`
  background: #ff5733;
  color: white;
  padding: 2px 16px;
  border-radius: 6px 6px 0 0;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 0;
  display: inline-block;
  margin-left: 0;
  position: relative;
  z-index: 2;
`;
