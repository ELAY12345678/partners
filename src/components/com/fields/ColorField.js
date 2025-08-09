import React, { useEffect, useState } from "react";
import { SketchPicker, CirclePicker } from "react-color";
import { Popover, Avatar, Button } from "antd";
import { WrappercolorFields } from "./Styles";
import reactCSS from "reactcss";
import _ from "lodash";

const formatRgbString = (color) => {
  const { r, g, b, a } =
    typeof color === "string" ? { r: 0, g: 0, b: 0, a: 100 } : color;
  return `rgb(${r},${g},${b},${a})`;
};

function obtenerComponentesRGBA(colorRGB) {
    // Se elimina el formato "rgb(" y ")" del string
    colorRGB = colorRGB.substring(4, colorRGB.length - 1);

    // Se separan los valores de las componentes por las comas
    const componentes = colorRGB.split(",");

    // Se obtienen los valores de r, g y b
    const r = parseInt(componentes[0]);
    const g = parseInt(componentes[1]);
    const b = parseInt(componentes[2]);

    // Se establece la opacidad predeterminada (alpha) como 1 si no está presente
    let a = 1;
    if (componentes.length === 4) {
        // Si hay un cuarto valor, se trata como el valor alpha
        a = parseFloat(componentes[3]);
    }

    // Se retorna un objeto con las componentes RGB y A
    return { r, g, b, a };
}

const ColorField = ({
  onChange,
  render,
  record,
  name,
  source,
  children,
  presetColors,
  ...props
}) => {
  const [background, setBackground] = useState();
  const [state, setState] = useState({
    color: props.initial || "#6B24F8",
    displayColorPicker: false,
  });
  const handleChange = (color) => {
    setState({ ...state, color: formatRgbString(color.rgb) });
    _handleOnChange(formatRgbString(color.rgb));
  };
  const handleChangeComplete = (color) => {
    setState({ ...state, color: formatRgbString(color.rgb) });
  };
  const handleOnChange = (color) => {
    if (onChange) onChange(color);
  };
  const _handleOnChange = _.debounce(handleOnChange, 1000, { maxWait: 1000 });

  const handleClick = () => {

    setState({ ...state, displayColorPicker: !state.displayColorPicker });
  };

  const handleClose = () => {
    setState({ ...state, displayColorPicker: false });
  };
  useEffect(() => {
    if (record && record[source || name])
      setState({
        ...state,
        color: record[name || source],
      });
  }, [record]);

  return (
    <WrappercolorFields color={state.color}>
      <Popover
        content={
          <div>
            <SketchPicker
              color={`${state.color}`.includes('#') ? state.color : obtenerComponentesRGBA(state.color) }
              onChange={handleChange}
              onChangeComplete={handleChangeComplete}
                name={source || name}
                presetColors={presetColors}
            />
          </div>
        }
        style={{ width: "50px" }}
      >
        <div className="swatch" onClick={handleClick} style={{ width: "50px" }}>
          <div className="color" style={{ width: "50px", height: "50px" }} />
        </div>
      </Popover>
    </WrappercolorFields>
  );
};
export default ColorField;
