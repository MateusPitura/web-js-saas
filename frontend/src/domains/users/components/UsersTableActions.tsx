import Button from "@/design-system/Button";
import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { DisableUser } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { BACKEND_URL } from "@/domains/global/constants";

interface UsersTableActionsProperties {
  isActive?: boolean;
  userId: string;
  fullName: string;
  handleDisableUserInfo: (user: DisableUser) => void;
}

export default function UsersTableActions({
  fullName,
  userId,
  isActive,
  handleDisableUserInfo,
}: UsersTableActionsProperties): ReactNode {
  const navigate = useNavigate();
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  async function enableUser() {
    await safeFetch(`${BACKEND_URL}/user/${userId}`, {
      method: "DELETE",
      body: { isActive: true },
      resource: "USERS",
      action: "DELETE",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: enableUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessSnackbar({
        title: `Usuário ${fullName} ativado com sucesso`,
      });
    },
  });

  return isActive ? (
    <>
      <Button
        variant="tertiary"
        fullWidth
        label="Editar"
        onClick={() => navigate(`/users/edit/${userId}`)}
        resource="USERS"
        action="UPDATE"
      />
      <Button
        variant="tertiary"
        fullWidth
        label="Desativar"
        onClick={() =>
          handleDisableUserInfo({
            userName: fullName,
            userId: userId,
          })
        }
        resource="USERS"
        action="DELETE"
      />
    </>
  ) : (
    <Button
      variant="tertiary"
      fullWidth
      label="Ativar"
      onClick={mutate}
      state={isPending ? "loading" : undefined}
      resource="USERS"
      action="DELETE"
    />
  );
}
