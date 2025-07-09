import Dialog from "@/design-system/Dialog";
import type { ReactNode } from "react";
import { DialogProps } from "@/domains/global/types";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import { BACKEND_URL } from "@/domains/global/constants";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { useMutation } from "@tanstack/react-query";

export default function RequestChangePasswordModal({
  ...dialog
}: DialogProps): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();

  async function handleRequestChangePassword() {
    await safeFetch(`${BACKEND_URL}/auth/request-change-password`, {
      method: "POST",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handleRequestChangePassword,
    onSuccess: () => {
      showSuccessSnackbar({
        title: "Um email será enviado",
        description: "Confira também a caixa de spam",
      });
      dialog.closeDialog();
    },
  });

  return (
    <Dialog {...dialog}>
      <Dialog.Header title={"Alteração de senha"} />
      <Dialog.Body>
        Caso deseje alterar a senha, clique no botão abaixo e siga as instruções
        enviadas para seu email
      </Dialog.Body>
      <Dialog.Footer
        labelSecondaryBtn="Cancelar"
        onClickPrimaryBtn={mutate}
        labelPrimaryBtn="Solicitar alteração"
        onClickSecondaryBtn={dialog.closeDialog}
        primaryBtnState={isPending ? "loading" : undefined}
      />
    </Dialog>
  );
}
