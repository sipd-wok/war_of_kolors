"use client";

import { useEffect } from "react";
import { useControls } from "leva";
import { updateSettings } from "./LevaControls";

export function LevaPanel() {
  const values = useControls({
    objectHeight: {
      value: 500,
      min: 10,
      max: 1024,
      step: 1,
    },
    objectWidth: {
      value: 500,
      min: 10,
      max: 1024,
      step: 1,
    },
    objectRotation: {
      value: 0,
      min: 0,
      max: 359,
      step: 1,
    },
  });

  useEffect(() => {
    updateSettings(values);
  }, [values]);

  return null; // Leva creates its own UI, so we don't need to render anything here
}
