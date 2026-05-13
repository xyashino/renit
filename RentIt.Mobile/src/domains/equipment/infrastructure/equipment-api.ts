import { apiClient } from '@/src/shared/api/client';
import { findStatusById } from '@/src/shared/domain';
import { findCategoryById, type Equipment } from '../domain';

function mapEquipment(dto: any): Equipment {
  return {
    id: Number(dto.id),
    name: dto.name,
    description: dto.description ?? '',
    imageUrl: dto.imageUrl ?? undefined,
    pricePerDay: Number(dto.pricePerDay),
    deposit: Number(dto.deposit),
    address: dto.address,
    userId: Number(dto.userId),
    categoryId: Number(dto.category),
    statusId: Number(dto.status),
    category: findCategoryById(Number(dto.category)),
    status: findStatusById(Number(dto.status)),
  };
}

function normalizeEquipmentListPayload(data: unknown): any[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.items)) return obj.items;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.$values)) return obj.$values;
  }
  return [];
}

export async function getEquipment(params?: {
  city?: string;
  categoryId?: number;
  dateFrom?: string;
  dateTo?: string;
}): Promise<Equipment[]> {
  const query: Record<string, string | number> = {};
  if (params?.city) query.city = params.city;
  if (params?.categoryId != null) query.category = params.categoryId;
  if (params?.dateFrom) query.dateFrom = params.dateFrom;
  if (params?.dateTo) query.dateTo = params.dateTo;

  const { data, error } = await apiClient.GET('/api/equipment', {
    params: { query: query as any },
  });
  if (error) throw new Error('Nie udało się załadować sprzętu');
  return normalizeEquipmentListPayload(data).map(mapEquipment);
}

export async function getEquipmentById(id: number): Promise<Equipment> {
  const { data, error } = await apiClient.GET('/api/equipment/{id}', {
    params: { path: { id } },
  });
  if (error) throw new Error('Nie udało się załadować sprzętu');
  return mapEquipment(data);
}

export async function createEquipment(body: {
  name: string;
  description?: string;
  imageUrl?: string;
  pricePerDay: number;
  deposit: number;
  address: string;
  userId: number;
  categoryId: number;
  statusId: number;
}): Promise<Equipment> {
  const { data, error } = await apiClient.POST('/api/equipment', {
    body: {
      name: body.name,
      description: body.description ?? '',
      imageUrl: body.imageUrl ?? null,
      pricePerDay: body.pricePerDay,
      deposit: body.deposit,
      address: body.address,
      userId: body.userId,
      category: body.categoryId,
      status: body.statusId,
    },
  });
  if (error) throw new Error('Nie udało się dodać sprzętu');
  return mapEquipment(data);
}

export async function updateEquipment(id: number, body: Record<string, unknown>): Promise<void> {
  const { error } = await apiClient.PUT('/api/equipment/{id}', {
    params: { path: { id } },
    body: {
      ...(body as any),
      imageUrl: (body as any).imageUrl ?? null,
      category: (body as any).categoryId,
      status: (body as any).statusId,
    },
  });
  if (error) throw new Error('Nie udało się zaktualizować sprzętu');
}

export async function deleteEquipment(id: number): Promise<void> {
  const { error } = await apiClient.DELETE('/api/equipment/{id}', {
    params: { path: { id } },
  });
  if (error) throw new Error('Nie udało się usunąć sprzętu');
}
