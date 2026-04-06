import React, { useEffect, useRef } from "react";
import Lottie from "lottie-react-native";

export const Lotties = (props) => {
  const { source, style } = props;

  const animationRef = useRef(null);

  useEffect(() => {
    // Give the component a tiny moment to mount
    const timer = setTimeout(() => {
      if (animationRef.current) {
        animationRef.current.reset();
        animationRef.current.play(30, 500); // ← play from frame 30 to 300
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [source]); // re-run if animation file changes

  return (
    <Lottie
      ref={animationRef}
      source={source}
      autoPlay={false} // we control it manually
      loop={false}
      style={style} // important: give it size!
      resizeMode="contain"
    />
  );
};
