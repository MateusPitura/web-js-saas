import Form from "@/design-system/Form";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Input from "@/design-system/Form/Input";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { s } from "@shared/safeZod";
import Dialog from "@/design-system/Dialog";
import { SchemaUserForm } from "@/domains/users/schemas";

const SchemaCpfForm = SchemaUserForm.pick({
  cpf: true,
});

type CpfFormInputs = s.infer<typeof SchemaCpfForm>;

interface CpfFormProps {
  defaultValues: Partial<CpfFormInputs>;
}

export default function CpfForm({ defaultValues }: CpfFormProps) {
  const { closeDialog } = useDialogContext();

  const { isPending, mutate } = useUpdateProfileInfo<CpfFormInputs>({
    onSuccessSubmit: closeDialog,
    snackbarTitle: "CPF atualizado com sucesso",
  });

  return (
    <Form<CpfFormInputs>
      onSubmit={mutate}
      defaultValues={defaultValues}
      schema={SchemaCpfForm}
    >
      <CpfFormContent isPending={isPending} />
    </Form>
  );
}

interface CpfFormContentProps {
  isPending: boolean;
}

function CpfFormContent({ isPending }: CpfFormContentProps) {
  return (
    <>
      <Dialog.Body>
        <Input<CpfFormInputs>
          name="cpf"
          label="CPF"
          mask="cpf"
          maxLength={14}
          forceUnselect
          autoFocus
        />
      </Dialog.Body>
      <Dialog.Footer
        primaryBtnState={isPending ? "loading" : undefined}
        dirty
        labelPrimaryBtn="Alterar"
      />
    </>
  );
}
