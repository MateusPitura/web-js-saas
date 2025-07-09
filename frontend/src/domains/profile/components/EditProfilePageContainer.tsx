import { User } from "@/domains/global/types/model";
import UserForm from "@/domains/global/forms/UserForm";
import {
  useIsFetching,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import selectProfileInfo from "../utils/selectProfileInfo";
import { BACKEND_URL } from "@/domains/global/constants";
import useSafeFetch from "@/domains/global/hooks/useSafeFetch";
import Spinner from "@/design-system/Spinner";
import { UserFormInputs } from "@/domains/users/types";
import useSnackbar from "@/domains/global/hooks/useSnackbar";
import { useNavigate } from "react-router-dom";
import parseAddressPayload from "@/domains/global/utils/parseAddressPayload";

export default function EditProfilePageContainer(): ReactNode {
  const { safeFetch } = useSafeFetch();
  const { showSuccessSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isFetchingCep = useIsFetching({ queryKey: ["cepApi"] });

  async function getProfileInfo(): Promise<User> {
    return await safeFetch(`${BACKEND_URL}/profile`);
  }

  const { data: profileData, isFetching } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileInfo,
    select: selectProfileInfo,
  });

  async function editUser(data: UserFormInputs) {
    const { address, ...rest } = data;

    const addressPayload = parseAddressPayload({
      newAddress: address,
      oldAddress: profileData?.address,
    });

    await safeFetch(`${BACKEND_URL}/profile`, {
      method: "PATCH",
      body: {
        ...rest,
        ...(addressPayload && { address: addressPayload }),
      },
    });
  }

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: editUser,
    onSuccess: async () => {
      showSuccessSnackbar({
        title: `Perfil atualizado com sucesso`,
      });
      queryClient.invalidateQueries({
        queryKey: ["usersDashboard"],
      });
      navigate("/profile");
    },
  });

  useEffect(
    () => () => {
      if (isSuccess) {
        queryClient.invalidateQueries({
          queryKey: ["profile"],
        });
      }
    },
    [isSuccess, queryClient]
  );

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    profileData && (
      <UserForm
        headerTitle="Editar informações pessoais"
        headerPrimaryBtnLabel="Alterar"
        defaultValues={profileData}
        onSubmit={mutate}
        isPending={isPending || !!isFetchingCep}
        isEdit
      />
    )
  );
}
