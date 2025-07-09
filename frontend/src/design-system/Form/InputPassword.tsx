import { useState, type ReactNode } from "react";

import Input from "./Input";
import { FieldValues, Path } from "react-hook-form";

interface InputPasswordProperties<T> {
  name: Path<T>;
  label: string;
  required?: boolean;
  autoFocus?: boolean;
}

export default function InputPassword<T extends FieldValues>({
  label,
  required,
  name,
  autoFocus = false,
}: InputPasswordProperties<T>): ReactNode {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input<T>
      name={name}
      label={label}
      required={required}
      iconRight={showPassword ? "Visibility" : "VisibilityOff"}
      onClickIconRight={() => setShowPassword((prevState) => !prevState)}
      type={showPassword ? "text" : "password"}
      autoFocus={autoFocus}
    />
  );
}
