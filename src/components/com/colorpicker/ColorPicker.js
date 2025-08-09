import React from "react";
import { colors } from "../../../constants/";
import { List } from "antd";
import { Wrapper, ItemWrapper } from "./Styles";
const ColorPicker = ({ onChange, props }) => {
  const renderItem = item => {
    return (
      <List.Item>
        <ItemWrapper
          onClick={e => {
            e.preventDefault();
            if (onChange) onChange(item);
          }}
          color={item}
        >
          <div className="color-container">
            <div className="color-picker" />
            <div className="color-background" />
          </div>
        </ItemWrapper>
      </List.Item>
    );
  };
  return (
    <Wrapper>
      <span>Select a color</span>
      <List
        style={{
          maxWidth: 150
        }}
        gutter={4}
        grid={{
          gutter: 4,
          xl: 3,
          lg: 3,
          md: 3,
          sm: 3,
          xs: 3
        }}
        dataSource={colors}
        renderItem={renderItem}
      />
    </Wrapper>
  );
};
export default ColorPicker;
