// components/SvgIcon.js

import React from "react";
import * as Icons from "../Assets/svg/index"; // path to your svg folder

const SvgIcon = ({
  name,
  width = 24,
  height = 24,
  color = "black",
  ...props
}) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn(`SVG icon '${name}' not found`);
    return null;
  }

  return (
    <IconComponent width={width} height={height} fill={color} {...props} />
  );
};

export default SvgIcon;
