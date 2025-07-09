import Button from "@/design-system/Button";
import Input from "@/design-system/Form/Input";
import { useEffect, useState, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import useSafeFetch from "../hooks/useSafeFetch";
import useSnackbar from "../hooks/useSnackbar";
import { useQuery } from "@tanstack/react-query";
import { addressDefaultValues } from "@/domains/users/constants";
import Tooltip from "@/design-system/Tooltip";
import { UserFormInputs } from "@/domains/users/types";

interface ViaCepAddress {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro: boolean;
}

interface AddressFieldsProps {
  defaultOpen?: boolean;
}

export default function AddressFields({
  defaultOpen = false,
}: AddressFieldsProps): ReactNode {
  const [currentValidCep, setCurrentValidCep] = useState("");
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const { setValue, trigger, getValues } = useFormContext<UserFormInputs>();

  const { safeFetch } = useSafeFetch();
  const { showErrorSnackbar } = useSnackbar();

  async function fillAddress() {
    const isValid = await trigger("address.cep");
    if (isValid) {
      const cep = getValues("address.cep");
      setCurrentValidCep(cep);
    }
  }

  async function getCepInfo(cep: string): Promise<ViaCepAddress | undefined> {
    return await safeFetch(`https://viacep.com.br/ws/${cep}/json/`, {
      enableCookie: false,
    });
  }

  const { data: cepInfo, isFetching } = useQuery({
    queryKey: ["cepApi", currentValidCep],
    queryFn: ({ queryKey }) => getCepInfo(queryKey[1]),
    enabled: !!currentValidCep,
  });

  useEffect(() => {
    if (cepInfo?.erro) {
      showErrorSnackbar({
        description: "CEP não encontrado",
      });
      return;
    }

    if (!cepInfo) return;

    setValue("address.street", cepInfo.logradouro, { shouldDirty: true });
    setValue("address.neighborhood", cepInfo.bairro, { shouldDirty: true });
    setValue("address.city", cepInfo.localidade, {
      shouldDirty: true,
    });
    setValue("address.state", cepInfo.uf, {
      shouldDirty: true,
    });
  }, [cepInfo, setValue, showErrorSnackbar]);

  function handleOnSubmitCepField(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      fillAddress();
    }
  }

  return !isOpen ? (
    <div className="col-span-full">
      <Button
        variant="secondary"
        label="Adicionar endereço"
        onClick={() => {
          setIsOpen(true);
          setValue("address", addressDefaultValues, { shouldDirty: true });
        }}
        fullWidth
        textAlign="center"
      />
    </div>
  ) : (
    <>
      <div className="flex items-center justify-end col-span-full">
        <Tooltip content="Remover endereço">
          <Button
            variant="tertiary"
            iconLeft="Delete"
            onClick={() => {
              setIsOpen(false);
              setValue("address", null, { shouldDirty: true });
            }}
          />
        </Tooltip>
      </div>
      <div
        className="flex items-center justify-between gap-1"
        onKeyDown={handleOnSubmitCepField}
      >
        <Input<UserFormInputs>
          label="CEP"
          name="address.cep"
          mask="cep"
          maxLength={9}
          required
          forceUnselect
        />
        <Button
          variant="quaternary"
          label="Preencher automaticamente"
          onClick={fillAddress}
          padding="none"
          state={isFetching ? "loading" : undefined}
        />
      </div>
      <Input<UserFormInputs> label="Número" name="address.number" required />
      <Input<UserFormInputs> label="Rua" name="address.street" />
      <Input<UserFormInputs> label="Bairro" name="address.neighborhood" />
      <Input<UserFormInputs> label="Cidade" name="address.city" />
      <Input<UserFormInputs> label="Estado" name="address.state" />
      <Input<UserFormInputs> label="Complemento" name="address.complement" />
    </>
  );
}
