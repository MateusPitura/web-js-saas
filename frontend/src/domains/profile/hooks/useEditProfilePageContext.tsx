import { useContext } from "react";
import { EditProfilePageContext } from "../contexts/EditProfilePageContext";

export default function useEditProfilePageContext() {
  const context = useContext(EditProfilePageContext);

  if (!context) {
    throw new Error(
      "useEditProfilePageContext must be used within a EditProfilePageProvider"
    );
  }

  return context;
}
