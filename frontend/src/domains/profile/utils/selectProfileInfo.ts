import { User } from "@/domains/global/types/model";
import { applyMask } from "@/domains/global/utils/applyMask";
import safeFormat from "@/domains/global/utils/safeFormat";
import { UserFormInputs } from "@/domains/users/types";

export default function selectProfileInfo(data: User): UserFormInputs {
  return {
    fullName: data.fullName,
    email: data.email,
    cellPhone: applyMask(data.cellPhone, "cellphone") ?? "",
    cpf: applyMask(data.cpf, "cpf") ?? "",
    code: data.code ?? "",
    birthDate: data.birthDate
      ? safeFormat({
          date: data.birthDate,
          format: "yyyy-MM-dd",
        })
      : "",
    address: data.address
      ? {
          cep: applyMask(data.address?.cep, "cep") ?? "",
          number: data.address?.number ?? "",
          street: data.address?.street ?? "",
          complement: data.address?.complement ?? "",
          neighborhood: data.address?.neighborhood ?? "",
          city: data.address?.city ?? "",
          state: data.address?.state ?? "",
        }
      : null,
  };
}
