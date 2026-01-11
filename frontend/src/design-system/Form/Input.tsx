import { applyMask } from "@/domains/global/utils/applyMask";
import { useEffect, type ReactElement } from "react";
import {
  FieldValues,
  Path,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form";
import Button from "../Button";
import ErrorLabel from "./ErrorLabel";
import { Mask } from "@/domains/global/types";
import { IconsName } from "../types";
import classNames from "classnames";

interface InputProperties<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  mask?: Mask;
  iconRight?: IconsName;
  onClickIconRight?: () => void;
  type?: string;
  maxLength?: number;
  required?: boolean;
  hideErrorLabel?: boolean;
  autoFocus?: boolean;
  forceUnselect?: boolean;
  disabled?: boolean;
}

export default function Input<T extends FieldValues>({
  label,
  name,
  placeholder,
  mask,
  iconRight,
  onClickIconRight,
  type = "text",
  maxLength,
  required,
  hideErrorLabel,
  autoFocus = false,
  forceUnselect,
  disabled = false,
}: InputProperties<T>): ReactElement {
  const { register, setValue } = useFormContext();
  const { errors } = useFormState({
    name,
  });
  const value = useWatch({ name }); // 🌠 trocar para apenas watch

  useEffect(() => {
    if (mask) {
      const valueFormatted = applyMask(value, mask);
      setValue<string>(name, valueFormatted);
    }
  }, [value, mask, name, setValue]);

  return (
    <label className="flex flex-col">
      <div>
        <span className="text-body-medium text-light-onSurface p-1">
          {label}
        </span>
        {required && (
          <span className="text-light-error text-body-medium">*</span>
        )}
      </div>
      <div
        className={classNames(
          "border-light-outline border-2 rounded-md flex items-center gap-1 overflow-hidden",
          {
            "!border-light-disabled": disabled,
          }
        )}
      >
        <input
          {...register(name)}
          className={classNames(
            "text-body-large text-light-onSurface bg-transparent p-1 px-2 caret-light-primary flex-1 h-10",
            {
              "!text-light-disabled": disabled,
            }
          )}
          autoComplete="on"
          placeholder={placeholder}
          type={type}
          maxLength={maxLength}
          required={required}
          autoFocus={autoFocus}
          tabIndex={forceUnselect ? -1 : undefined}
          disabled={disabled}
          onBlur={(event) =>
            setValue<string>(name, event.target.value.trim(), {
              shouldDirty: true,
            })
          }
        />
        {iconRight && (
          <div className="px-2">
            <Button
              variant="tertiary"
              iconRight={iconRight}
              padding="none"
              onClick={onClickIconRight}
            />
          </div>
        )}
      </div>
      {hideErrorLabel || <ErrorLabel errors={errors} name={name} />}
    </label>
  );
}
