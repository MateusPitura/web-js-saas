import { Childrenable } from "@/domains/global/types";
import { createContext, useMemo, useState } from "react";

interface EditProfilePageContextValues {
  example: string;
  handleExample: (value: string) => void;
}

const EditProfilePageContext = createContext<EditProfilePageContextValues | null>(null);

function EditProfilePageProvider({ children }: Childrenable) {
  const [example, setExample] = useState("");

  function handleExample(value: string) {
    setExample(value);
  }

  const valuesMemoized = useMemo(
    () => ({
      example,
      handleExample,
    }),
    [example]
  );

  return (
    <EditProfilePageContext.Provider value={valuesMemoized}>
      {children}
    </EditProfilePageContext.Provider>
  );
}

export { EditProfilePageContext, EditProfilePageProvider };
