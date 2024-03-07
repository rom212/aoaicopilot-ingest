"use client";

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";

const InputBar = forwardRef(function InputBar(props, ref) {
  return (
    <input
      type="text"
      id="inputQuestion"
      name="inputQuestion"
      ref={ref}
      placeholder="Type here..."
    />
  );
});

export default InputBar;
