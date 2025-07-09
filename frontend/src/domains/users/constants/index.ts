import { SEED_ROLE_ADMIN_ID } from "@shared/constants";
import { UserFormInputs, UsersFilterFormInputs } from "../types";

export const addressDefaultValues: UserFormInputs['address'] = {
  cep: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  complement: "",
};

export const userDefaultValues: UserFormInputs = {
  fullName: "",
  email: "",
  cellPhone: "",
  cpf: "",
  code: "",
  birthDate: "",
  address: null,
  roleId: String(SEED_ROLE_ADMIN_ID),
};

export const userFilterDefaultValues: UsersFilterFormInputs = {
  fullName: "",
  orderBy: "fullName",
  status: "active",
};
