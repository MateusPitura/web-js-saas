import { type ReactElement } from "react";
import useUpdateProfileInfo from "../hooks/useUpdateProfileInfo";
import Input from "@/design-system/Form/Input";
import Form from "@/design-system/Form";
import useDialogContext from "@/domains/global/hooks/useDialogContext";
import { s } from "@shared/safeZod";
import Dialog from "@/design-system/Dialog";
import { SchemaUserForm } from "@/domains/users/schemas";

const SchemaFullNameForm = SchemaUserForm.pick({
  fullName: true,
})

type FullNameFormInputs = s.infer<typeof SchemaFullNameForm>;

interface FullNameFormProperties {
  defaultValues: Partial<FullNameFormInputs>;
}

export default function FullNameForm({
  defaultValues,
}: FullNameFormProperties): ReactElement {
  const { closeDialog } = useDialogContext();

  const { mutate, isPending } = useUpdateProfileInfo<FullNameFormInputs>({
    onSuccessSubmit: closeDialog,
    snackbarTitle: "Nome completo atualizado com sucesso",
  });

  return (
    <Form<FullNameFormInputs>
      onSubmit={mutate}
      defaultValues={defaultValues}
      schema={SchemaFullNameForm}
    >
      <FullNameFormContent isPending={isPending} />
    </Form>
  );
}

interface FullNameFormContentProps {
  isPending: boolean;
}

function FullNameFormContent({
  isPending,
}: FullNameFormContentProps): ReactElement {
  return (
    <>
      <Dialog.Body>
        <Input<FullNameFormInputs>
          name="fullName"
          label="Nome completo"
          required
          autoSelect={false}
          autoFocus
        />
      </Dialog.Body>
      <Dialog.Footer
        labelPrimaryBtn="Alterar"
        primaryBtnState={isPending ? "loading" : undefined}
        dirty
      />
    </>
  );
}
