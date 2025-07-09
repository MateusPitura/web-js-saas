import { s } from '@shared/safeZod';
import { createZodDto } from 'nestjs-zod';

const SchemaAddress = s.object({
  street: s.string().nullish(),
  neighborhood: s.string().nullish(),
  city: s.string().nullish(),
  state: s.string().nullish(),
  complement: s.string().nullish(),
});

const SchemaAddressToCreate = s.SchemaAddress.extend({
  ...SchemaAddress.shape,
});
const SchemaAddressToUpdate = s.SchemaAddress.partial().extend({
  ...SchemaAddress.shape,
});

const SchemaUserPostInDto = s.object({
  fullName: s.fullName(),
  email: s.email(),
  cpf: s.cpf().nullish(),
  birthDate: s.birthDate().nullish(),
  code: s.string().nullish(),
  cellPhone: s.cellphone().nullish(),
  address: SchemaAddressToCreate.nullish(),
  roleId: s.id(),
});

const SchemaUserCreateInDto = SchemaUserPostInDto.extend({
  clientId: s.id(),
});

const SchemaUserFindManyInDto = s.object({
  page: s.number().optional(),
  status: s.list(['active', 'inactive']).optional(),
  fullName: s.fullName().optional(),
  orderBy: s.list(['fullName', 'email']).optional(),
});

const SchemaUserGeneratePdfInDto = SchemaUserFindManyInDto.omit({ page: true });

const SchemaUserGenerateSheetInDto = SchemaUserGeneratePdfInDto;

const SchemaUserUpdateInDto = SchemaUserPostInDto.extend({
  address: s
    .object({
      remove: s.boolean(),
      add: SchemaAddressToCreate,
      update: SchemaAddressToUpdate,
    })
    .partial(),
  password: s.password(),
  isActive: s.boolean(),
  jit: s.string(36).nullable(),
})
  .omit({ email: true })
  .partial();

const SchemaProfilePatchInDto = SchemaUserUpdateInDto.omit({
  roleId: true,
  isActive: true,
});

const SchemaUserDeleteInDto = s.object({
  isActive: s.boolean(),
});

export const SchemaUserPatchInDto = SchemaUserUpdateInDto.omit({
  isActive: true,
});

export class UserPostInDto extends createZodDto(SchemaUserPostInDto) {}
export class UserCreateInDto extends createZodDto(SchemaUserCreateInDto) {}
export class UserGeneratePdfInDto extends createZodDto(
  SchemaUserGeneratePdfInDto,
) {}
export class UserGenerateSheetInDto extends createZodDto(
  SchemaUserGenerateSheetInDto,
) {}
export class UserFindManyInDto extends createZodDto(SchemaUserFindManyInDto) {}
export class UserPatchInDto extends createZodDto(SchemaUserPatchInDto) {}
export class ProfilePatchInDto extends createZodDto(SchemaProfilePatchInDto) {}
export class UserUpdateInDto extends createZodDto(SchemaUserUpdateInDto) {}
export class UserDeleteInDto extends createZodDto(SchemaUserDeleteInDto) {}
