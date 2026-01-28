import React, { useEffect, useRef } from "react";
import Lottie from "lottie-react-native";

export const Lotties = (props) => {
  const { source, style } = props;
  const animationRef = useRef < Lottie > null;
  useEffect(() => {
    animationRef.current?.play();
    animationRef.current?.play(30, 120);
  }, []);

  return <Lottie style={style} autoPlay={true} loop={false} source={source} />;
};
