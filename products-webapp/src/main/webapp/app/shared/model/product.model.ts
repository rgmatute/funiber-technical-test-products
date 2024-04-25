export interface IProduct {
    id?: number;
    serial_code?: string | null;
    name?: string | null;
    description?: string | null;
    price?: number | null;
    stock?: number | null;
    iva?: number | null;
    discount?: number | null;
    resource_id?: string | null;
    catalog_id?: any | null;
    status?: boolean | null;
    created_by?: string | null;
  }
  
  export class Product implements IProduct {
    constructor(
      id?: number,
      serial_code?: string | null,
      name?: string | null,
      description?: string | null,
      price?: number | null,
      stock?: number | null,
      iva?: number | null,
      discount?: number | null,
      resource_id?: string | null,
      catalog_id?: any | null,
      status?: boolean | null,
      created_by?: string | null
    ) {}
  }
  