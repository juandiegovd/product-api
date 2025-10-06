export interface IContentfulFieldsResponse {
  sku?: string;
  name?: string;
  brand?: string;
  model?: string;
  category?: string;
  color?: string;
  price?: number;
  currency?: string;
  stock?: number;
}

export interface IContentfulSysResponse {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IContentfulItemResponse {
  sys: IContentfulSysResponse;
  fields?: IContentfulFieldsResponse;
}

export interface IContentfulResponse {
  total: number;
  skip: number;
  limit: number;
  items: IContentfulItemResponse[];
}
