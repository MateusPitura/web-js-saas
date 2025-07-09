import PageHeader from "@/domains/global/components/PageHeader";
import Section from "@/domains/global/components/Section";
import { type ReactElement } from "react";
import useDialog from "@/domains/global/hooks/useDialog";
import { useNavigate } from "react-router-dom";
import RequestChangePasswordModal from "./RequestChangePasswordModal";

export default function ProfileContainer(): ReactElement {
  const dialog = useDialog();

  const navigate = useNavigate();

  return (
    <>
      <RequestChangePasswordModal {...dialog} />
      <div className="flex flex-col gap-4">
        <PageHeader title="Perfil" />
        <div className="flex justify-center">
          <Section>
            <Section.Title title="Seus dados" />
            <Section.Group>
              <Section.Header title="Conta" />
              <Section.Row
                label="Informações pessoais"
                onEdit={() => navigate("/profile/edit")}
              />
              <Section.Row label="Senha" onEdit={() => dialog.openDialog()} />
            </Section.Group>
          </Section>
        </div>
      </div>
    </>
  );
}
