export interface CPUUsage {
  time: string;
  value: number;
}

export type EventVariants = 'critical' | 'warning' | 'info';

// Тип для события
export interface EventType {
  id: number;
  event: string;
  type: EventVariants;
  date: string; // Формат: DD.MM.YYYY
  time: string; // Формат: HH:MM
}

export type ObjectTypeVariants = 'EMS' | 'Network Node' | 'Data Element SNMP';

// Тип для объекта
export interface ObjectType {
  object_id: number;
  object_name: string;
  object_type: ObjectTypeVariants;
  object_description: string;
}

// Тип для запроса на управление объектом
export type ManageObjectOperation = 'insert' | 'update' | 'delete';

export interface InsertObjectData {
  object_name: string;
  object_type: ObjectTypeVariants;
  object_description: string;
}

export interface UpdateObjectData {
  object_id: number;
  object_name?: string;
  object_type?: ObjectTypeVariants;
  object_description?: string;
}

export interface DeleteObjectData {
  object_id: number;
}

export interface ManageObjectRequest {
  operation_type: ManageObjectOperation;
  data: InsertObjectData | UpdateObjectData | DeleteObjectData;
}

export interface ManageObjectResponse {
  operation: ManageObjectOperation;
  object_id?: number;
  object_instance?: ObjectType;
  updated_param?: string;
  timestamp: string;
  errors: string;
}
