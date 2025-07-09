import Dialog from "@/design-system/Dialog";
import Form from "@/design-system/Form";
import Input from "@/design-system/Form/Input";
import { BACKEND_URL } from "@/domains/global/constants";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { SchemaUserForm } from "@/domains/users/schemas";
import { s } from "@shared/safeZod";
import { useMutation } from "@tanstack/react-query";
import type { ReactNode } from "react";

const SchemaForgetPasswordForm = SchemaUserForm.pick({
  email: true,
});

type ForgetPasswordFormInputs = s.infer<typeof SchemaForgetPasswordForm>;

export default function ForgetPasswordForm(): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const { closeDialog } = useDialogContext();

  async function handleForgetPassword(data: ForgetPasswordFormInputs) {
    await safeFetch(`${BACKEND_URL}/auth/forget-password`, {
      method: "POST",
      body: data,
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handleForgetPassword,
    onSuccess: () => {
      showSuccessSnackbar({
        title: "Um email será enviado",
        description: "Confira também a caixa de spam",
      });
      closeDialog();
    },
  });

  return (
    <Form<ForgetPasswordFormInputs>
      defaultValues={{ email: "" }}
      schema={SchemaForgetPasswordForm}
      onSubmit={mutate}
    >
      <Dialog.Body>
        <div className="flex flex-col gap-4">
          <span className="text-body-large text-light-onSurface">
            Insira seu email para enviarmos as instruções para recuperar sua senha
          </span>
          <Input<ForgetPasswordFormInputs>
            name="email"
            label="Email"
            required
          />
        </div>
      </Dialog.Body>
      <Dialog.Footer
        labelPrimaryBtn="Enviar"
        dirty
        primaryBtnState={isPending ? "loading" : undefined}
      />
    </Form>
  );
}
