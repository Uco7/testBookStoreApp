import React from "react";
import { StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useTheme } from "../context/ThemeContext";

const DropDownTheme = ({
  open,
  setOpen,
  value,
  setValue,
  items = [],
  setItems,

  placeholder = "Select",

  multiple = false,
  mode = "BADGE",

  zIndex = 1000,

  style,
  containerStyle,

  disabled = false,
}) => {
  const { theme } = useTheme();

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}

      placeholder={placeholder}

      multiple={multiple}
      mode={mode}

      disabled={disabled}

      listMode="SCROLLVIEW"

      closeAfterSelecting={!multiple}

      dropDownDirection="TOP"

      zIndex={zIndex}
      zIndexInverse={1000}

      min={0}
      max={20}

      searchable={false}

      style={[
        styles.dropdown,
        {
          backgroundColor:
            theme.inputBacground,

          borderColor:
            theme.border || "#ccc",
        },
        style,
      ]}

      containerStyle={[
        {
          width: "100%",
        },
        containerStyle,
      ]}

      dropDownContainerStyle={{
        backgroundColor:
          theme.inputBacground,

        borderColor:
          theme.border || "#ccc",
      }}

      textStyle={{
        color: theme.text,
        fontSize: 14,
      }}

      placeholderStyle={{
        color: theme.text,
        opacity: 0.5,
      }}

      selectedItemContainerStyle={{
        backgroundColor:
          theme.primary || "#6d3fd3",
      }}

      selectedItemLabelStyle={{
        color: "#fff",
        fontWeight: "bold",
      }}

      badgeStyle={{
        backgroundColor:
          theme.primary || "#6d3fd3",
      }}

      badgeTextStyle={{
        color: "#fff",
      }}
    />
  );
};

export default DropDownTheme;

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 55,
    paddingHorizontal: 10,
  },
});