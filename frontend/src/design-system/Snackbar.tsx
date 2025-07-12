import { useToast } from "@/hooks/use-toast";
import type { ReactElement } from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import classNames from "classnames";

export default function Snackbar(): ReactElement {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        return (
          <Toast
            key={id}
            variant={variant}
            {...props}
            className={classNames(
              "bg-light-surfaceContainerLowest border-light-surfaceContainerLowest mt-2 [&>button]:!ring-0 [&>button]!outline-none [&>button]:!ring-offset-0",
              {
                "bg-light-error border-light-error": variant === "destructive",
              }
            )}
          >
            <div className="grid gap-1 flex-1 overflow-hidden">
              {title && (
                <ToastTitle>
                  <span
                    className={classNames(
                      "text-light-onSurface text-title-medium line-clamp-1",
                      {
                        "!text-light-onError": variant === "destructive",
                      }
                    )}
                  >
                    {title}
                  </span>
                </ToastTitle>
              )}
              {description && (
                <ToastDescription>
                  <span
                    className={classNames(
                      "text-light-onSurface text-body-medium line-clamp-1",
                      {
                        "!text-light-onError": variant === "destructive",
                      }
                    )}
                  >
                    {description}
                  </span>
                </ToastDescription>
              )}
            </div>
            {action && <div>{action}</div>}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
