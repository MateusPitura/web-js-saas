import type { ReactNode } from "react";
import { EditProfilePageProvider } from "../contexts/EditProfilePageContext";
import EditProfilePageContainer from "./EditProfilePageContainer";

export default function EditProfilePage(): ReactNode {
  return (
    <EditProfilePageProvider>
      <EditProfilePageContainer />
    </EditProfilePageProvider>
  );
}
