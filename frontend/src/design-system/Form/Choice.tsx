import { Childrenable } from "@/domains/global/types";
import {
  Children,
  cloneElement,
  ReactNode,
  useMemo,
  type ReactElement,
} from "react";
import {
  FieldValues,
  Path,
  useFormContext,
  useFormState,
} from "react-hook-form";
import ErrorLabel from "./ErrorLabel";

interface ContainerProps<T extends FieldValues> extends Childrenable {
  name: Path<T>;
  hideErrorLabel?: boolean;
}

function Container<T extends FieldValues>({
  children,
  name,
  hideErrorLabel,
}: ContainerProps<T>): ReactElement {
  const enhancedChildren = useMemo(
    () =>
      Children.map(children, (child) => {
        return cloneElement(child as ReactElement, { name, hideErrorLabel });
      }),
    [children, name, hideErrorLabel]
  );

  return <>{enhancedChildren}</>;
}

interface RadioProperties {
  label: string;
  name?: string;
  required?: boolean;
  value: string | number;
  hideErrorLabel?: boolean;
}

function Radio({
  label,
  name,
  hideErrorLabel,
  ...props
}: RadioProperties): ReactNode {
  const { register } = useFormContext();

  const { errors } = useFormState({
    name,
  });

  if (!name) return;

  return (
    <label className="flex gap-2 items-start cursor-pointer hover:opacity-50">
      <div className="grid place-items-center mt-1">
        <input
          type="radio"
          {...register(name)}
          className="peer col-start-1 row-start-1 appearance-none shrink-0 w-4 h-4 border-2 border-light-primary rounded-full disabled:border-light-disabled cursor-pointer"
          {...props}
        />
        <div className="col-start-1 row-start-1 w-2 h-2 rounded-full peer-checked:bg-light-primary peer-checked:peer-disabled:bg-light-disabled" />
      </div>
      <div className="text-body-large text-light-onSurface">{label}</div>
      {hideErrorLabel || <ErrorLabel errors={errors} name={name} />}
    </label>
  );
}

type CheckboxProperties = RadioProperties;

function Checkbox({
  label,
  name,
  hideErrorLabel,
  ...props
}: CheckboxProperties): ReactNode {
  const { register } = useFormContext();

  const { errors } = useFormState({
    name,
  });

  if (!name) return;

  return (
    <label className="flex gap-2 items-center cursor-pointer hover:opacity-50">
      <input
        type="checkbox"
        {...register(name)}
        className="col-start-1 row-start-1 shrink-0 w-4 h-4 border-2 accent-light-primary disabled:border-light-disabled cursor-pointer"
        {...props}
      />
      <div className="text-body-large text-light-onSurface">{label}</div>
      {hideErrorLabel || <ErrorLabel errors={errors} name={name} />}
    </label>
  );
}

const Choice = Object.assign(Container, { Radio, Checkbox });

export default Choice;
