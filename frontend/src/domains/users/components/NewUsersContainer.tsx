import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import {
  useIsFetching,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import UserForm from "@/domains/global/forms/UserForm";
import { UserFormInputs } from "../types";
import { BACKEND_URL } from "@/domains/global/constants";
import { userDefaultValues } from "../constants";

export default function NewUsersContainer(): ReactElement {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const isFetching = useIsFetching({ queryKey: ["cepApi"] });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function createUser(data: UserFormInputs) {
    await safeFetch(`${BACKEND_URL}/user`, {
      method: "POST",
      body: data,
      resource: "USERS",
      action: "CREATE",
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      showSuccessSnackbar({
        title: "Um email será enviado",
        description: "Confira também a caixa de spam",
      });
      navigate("/users");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["usersDashboard"] });
    },
  });

  return (
    <UserForm
      defaultValues={userDefaultValues}
      onSubmit={mutate}
      isPending={isPending || !!isFetching}
      headerPrimaryBtnLabel="Criar"
      headerTitle="Novo usuário"
      resource="USERS"
      action="CREATE"
      allowEditRole
    />
  );
}
