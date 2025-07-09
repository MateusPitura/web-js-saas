import classNames from "classnames";
import { forwardRef } from "react";
import Tooltip from "./Tooltip";
import useCheckPermission from "@/domains/global/hooks/useCheckPermission";
import { ButtonState, IconsName } from "./types";
import { Action, Resource } from "@shared/types";
import { formatDeniedMessage } from "@shared/utils/formatDeniedMessage";
import Icon from "./Icon";

interface BaseButtonProps {
  state?: ButtonState;
  className?: string;
  label?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  textAlign?: "start" | "center" | "end";
  iconLeft?: IconsName;
  iconRight?: IconsName;
  padding?: "default" | "none";
  type?: "submit" | "button";
}

const BaseButton = forwardRef(
  (
    {
      state = undefined,
      fullWidth = false,
      textAlign = "start",
      padding = "default",
      type = "button",
      className,
      label,
      iconLeft,
      iconRight,
      ...props
    }: BaseButtonProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        className={classNames(
          "rounded-md h-10 hover:opacity-50 flex items-center gap-4 w-fit",
          className,
          {
            "pointer-events-none": state === "disabled",
            "pointer-events-none animate-pulse": state === "loading",
            "!w-full": fullWidth,
            "px-4": padding === "default",
            "px-0": padding === "none",
          }
        )}
        disabled={state === "disabled" || state === "loading"}
        type={type}
        ref={ref}
        {...props}
      >
        {iconLeft && (
          <div className="flex flex-1 justify-center">
            <Icon iconName={iconLeft} />
          </div>
        )}
        {label && (
          <span
            className={classNames("text-label-large flex w-full", {
              "justify-center": textAlign === "center",
              "justify-start": textAlign === "start",
              "justify-end": textAlign === "end",
            })}
          >
            {label}
          </span>
        )}
        {iconRight && (
          <div className="flex flex-1 justify-center">
            {<Icon iconName={iconRight} />}
          </div>
        )}
      </button>
    );
  }
);

interface ButtonVariantProps extends BaseButtonProps {
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
}

const ButtonVariant = forwardRef(
  (
    {
      variant = "primary",
      state = undefined,
      className,
      ...props
    }: ButtonVariantProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    switch (variant) {
      case "primary":
        return (
          <BaseButton
            className={classNames(
              "bg-light-primary text-light-onPrimary",
              className,
              {
                "bg-light-secondary": state === "active",
                "!bg-light-error": state === "red",
                "!bg-light-disabled": state === "disabled" || state === "loading",
              }
            )}
            state={state}
            ref={ref}
            {...props}
          />
        );
      case "secondary":
        return (
          <BaseButton
            className={classNames(
              "border-light-primary border-2 text-light-primary",
              className,
              {
                "bg-light-primaryContainer": state === "active",
                "!border-light-error !text-light-error": state === "red",
                "border-light-disabled text-light-disabled":
                  state === "disabled" || state === "loading",
              }
            )}
            state={state}
            ref={ref}
            {...props}
          />
        );
      case "tertiary":
        return (
          <BaseButton
            className={classNames("text-light-onSurface", className, {
              "text-light-primary": state === "active",
              "!text-light-error": state === "red",
              "text-light-disabled": state === "disabled" || state === "loading",
            })}
            state={state}
            ref={ref}
            {...props}
          />
        );
      case "quaternary":
        return (
          <BaseButton
            className={classNames("text-light-primary", className, {
              "bg-light-primaryContainer": state === "active",
              "!text-light-error": state === "red",
              "text-light-disabled": state === "disabled" || state === "loading",
            })}
            state={state}
            ref={ref}
            {...props}
          />
        );
    }
  }
);

interface ButtonProps extends ButtonVariantProps {
  resource?: Resource;
  action?: Action;
}

const Button = forwardRef(
  (
    { resource, action, onClick, state, ...props }: ButtonProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const hasPermission = useCheckPermission(resource, action);

    return (
      <Tooltip
        content={formatDeniedMessage({ resource, action })}
        disabled={hasPermission}
      >
        <div className={classNames({ "cursor-not-allowed": !hasPermission })}>
          <ButtonVariant
            {...props}
            ref={ref}
            onClick={hasPermission ? onClick : () => {}}
            state={hasPermission ? state : "disabled"}
          />
        </div>
      </Tooltip>
    );
  }
);

export default Button;
