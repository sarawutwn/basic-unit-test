import type { IDealer } from "./dealer.domain";

export interface IProduct {
    id: number;
    running_number?: string;
    factory_number?: string;
    short_name?: string;
    name?: string;
    model?: string;
    brand?: string;
    cost?: number;
    sale_price?: number;
    technician_price?: number;
    price2?: number;
    special_price_one?: number;
    special_price_two?: number;
    authentic_code?: string;
    category_id?: number;
    secret_code: string;
    special_search?: string[];
    created_by_id?: number;
    dealer_id?: number;
    last_price?: number;
    unit_big?: string;
    unit_small?: string;
    storage_location?: string;
    substitute_product_name?: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    dealer?: IDealer | null;
}