export type CreateOrderItemDto = {
  sku?: string;
  name: string;
  description?: string;
  value: number;
  weight: number;
  quantity: number;
  height?: number;
  length?: number;
  width?: number;
};

type CreateOrderCoordinateDto = {
  latitude: number;
  longitude: number;
};

type CreateOrderBaseDto = {
  shipper_contact_name?: string;
  shipper_contact_phone?: string;
  shipper_contact_email?: string;
  shipper_organization?: string;
  origin_contact_name: string;
  origin_contact_phone: string;
  origin_contact_email?: string;
  origin_address: string;
  origin_note?: string;
  origin_coordinate?: CreateOrderCoordinateDto; //
  origin_postal_code?: string; //
  destination_contact_name: string;
  destination_contact_phone: string;
  destination_contact_email?: string;
  destination_address: string;
  destination_postal_code?: string;
  destination_note?: string;
  destination_coordinate?: CreateOrderCoordinateDto;
  destination_cash_on_delivery?: number;
  destination_cash_on_delivery_type?: '3_days' | '5_days' | '7_days';
  destination_cash_proof_of_delivery?: boolean;
  courier_company: string;
  courier_type: string;
  courier_insurance?: number;
  delivery_type: 'now' | 'scheduled';
  delivery_date?: string; //
  delivery_time?: string; //
  order_note?: string;
  metadata?: object;
  reference_id?: string;
  items: CreateOrderItemDto[];
};

export type CreateOrderDto = CreateOrderBaseDto;

export type QueryCourierRatesItemDto = {
  sku?: string;
  name: string;
  description?: string;
  value: number;
  length?: number;
  width?: number;
  height?: number;
  weight: number;
  quantity: number;
};
export type QueryCourierRatesDto = {
  type?: 'origin_suggestion_to_closest_destination';
  origin_area_id?: string;
  origin_postal_code?: number;
  origin_latitude?: string;
  origin_longitude?: string;
  destination_area_id?: string;
  destination_postal_code?: number;
  destination_latitude?: string;
  destination_longitude?: string;
  couriers: string;
  items: QueryCourierRatesItemDto[];
};

export type OrderStatusWebhookDto = {
  event: 'order.status';
  courier_tracking_id: string;
  courier_waybill_id: string;
  courier_company: string;
  courier_type: string;
  courier_driver_name: string;
  courier_driver_phone: string;
  courier_link: string;
  order_id: string;
  order_price: number;
  status: 'confirmed';
};

export type OrderPriceWebhookDto = {
  event: 'order.price';
  cash_on_delivery_fee: number;
  courier_tracking_id: string;
  courier_waybill_id: string;
  order_id: string;
  price: number;
  proof_of_delivery_fee: number;
  shippment_fee: number;
  status: 'picked';
};

export type OrderWaybillIdWebhookDto = {
  event: 'order.waybill_id';
  order_id: string;
  courier_tracking_id: string;
  courier_waybill_id: string;
  status: 'picked';
};
