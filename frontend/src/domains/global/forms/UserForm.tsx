import Form from "@/design-system/Form";
import Choice from "@/design-system/Form/Choice";
import Input from "@/design-system/Form/Input";
import AddressFields from "@/domains/global/components/AddressFields";
import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SchemaUserForm } from "../../users/schemas";
import { UserFormInputs } from "../../users/types";
import { SEED_ROLE_ADMIN_ID, SEED_ROLE_SALES_ID } from "@shared/constants";
import { Action, Resource } from "@shared/types";

const PREVIOUS_PAGE = -1;

interface UserFormProperties {
  defaultValues: Partial<UserFormInputs>;
  onSubmit: (data: UserFormInputs) => void;
  isPending: boolean;
  headerPrimaryBtnLabel: string;
  headerTitle: string;
  isEdit?: boolean;
  resource?: Resource;
  action?: Action;
  allowEditRole?: boolean;
}

export default function UserForm({
  defaultValues,
  onSubmit,
  isPending,
  headerPrimaryBtnLabel,
  headerTitle,
  isEdit = false,
  resource,
  action,
  allowEditRole = false,
}: UserFormProperties): ReactNode {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <Form<UserFormInputs>
        schema={SchemaUserForm}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        className="gap-4 flex flex-col"
        onlyDirty={isEdit}
      >
        <PageHeader
          title={headerTitle}
          primaryButtonLabel={headerPrimaryBtnLabel}
          secondaryButtonLabel="Cancelar"
          onClickSecondaryBtn={() => navigate(PREVIOUS_PAGE)}
          primaryBtnState={isPending ? "loading" : undefined}
          dirty
          primaryBtnResource={resource}
          primaryBtnAction={action}
        />
        <div className="flex justify-center">
          <Section>
            <Section.Title title="Informações pessoais" />
            <Section.Group>
              <Section.Header title="Dados" />
              <Section.Body>
                <Input<UserFormInputs>
                  name="fullName"
                  label="Nome completo"
                  required
                  autoFocus
                />
                <Input<UserFormInputs>
                  name="email"
                  label="Email"
                  required
                  disabled={isEdit}
                  type="email"
                />
                <Input<UserFormInputs>
                  name="cellPhone"
                  label="Celular"
                  mask="cellphone"
                  maxLength={15}
                  type="tel"
                />
                <Input<UserFormInputs>
                  name="cpf"
                  label="CPF"
                  mask="cpf"
                  maxLength={14}
                />
                <Input<UserFormInputs> name="code" label="Matrícula" />
                <Input<UserFormInputs>
                  name="birthDate"
                  label="Data de nascimento"
                  type="date"
                />
              </Section.Body>
            </Section.Group>
            <Section.Group>
              <Section.Header title="Endereço" />
              <Section.Body>
                <AddressFields defaultOpen={!!defaultValues.address} />
              </Section.Body>
            </Section.Group>
            {allowEditRole && (
              <Section.Group>
                <Section.Header title="Categoria" />
                <Section.Body>
                  <Choice<UserFormInputs> name="roleId">
                    <Choice.Radio
                      label="Administrador"
                      value={SEED_ROLE_ADMIN_ID}
                    />
                    <Choice.Radio label="Vendedor" value={SEED_ROLE_SALES_ID} />
                  </Choice>
                </Section.Body>
              </Section.Group>
            )}
          </Section>
        </div>
      </Form>
    </div>
  );
}
