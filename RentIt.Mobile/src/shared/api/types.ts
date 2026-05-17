import type { components } from './generated/api';

export type ApiSchemas = components['schemas'];

export type ApiCategoryDto = ApiSchemas['CategoryDto'];
export type ApiEquipmentDto = ApiSchemas['EquipmentDto'];
export type ApiFavoriteEquipmentDto = ApiSchemas['FavoriteEquipmentDto'];

export type ApiRentalDto = ApiSchemas['RentalDto'];
export type ApiCreateRentalDto = ApiSchemas['CreateRentalDto'];
export type ApiUpdateRentalStatusDto = ApiSchemas['UpdateRentalStatusDto'];
