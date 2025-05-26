// app/types/index.ts

export interface Property {
  id: number;
  address: string;
  unit_number: string;
  floor: string;
  size_m2: number;
  rooms: number;
  total_price: number;
  status: 'available' | 'reserved' | 'sold';
  images: string[];
  project: string;
  energy_class: string;
  year_built: number;
  monthly_rent_cold: number;
  outdoor_space?: string;
  building_condition?: string;
  asset_class?: string;
  investment_class?: string;
  heating_type?: string;
  house_fee?: number;
  management_costs?: number;
  mea?: number;
  value_growth_percent?: number;
  rent_increase_percent?: number;
  commission_percent?: number;
  land_share?: number;
  building_share?: number;
  maintenance_costs?: number;
  furniture_price?: number;
  depreciation_land?: number;
  depreciation_building?: number;
  depreciation_rate_percent?: number;
  deductible_maintenance_costs?: number;
  financing_costs_deductible?: number;
  final_price?: number;
  concept?: string;
  kfw?: string;
  property_status?: string;
  rental_status?: string;
  provider?: string;
}

export interface Reservation {
  id: number;
  property: string;
  property_id: number;
  status: 'Angefragt' | 'Reserviert' | 'Notarvorbereitung' | 'Notartermin' | 'Verkauft' | 'Abgebrochen';
  buyer: string;
  buyer_first_name?: string;
  buyer_last_name?: string;
  buyer_phone?: string;
  buyer_email?: string;
  date: string;
  notar_date?: string;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'supervisor' | 'sales';
  first_name: string;
  last_name: string;
  company_id?: string;
  supervisor_id?: string;
  transaction_fee_percent?: number;
  custom_commission_percent?: number;
  interest_rate?: number;
  payback_rate?: number;
  tax_settings?: Record<string, any>;
}

export interface Company {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  company_id: string;
}

export interface DashboardStats {
  label: string;
  value: string;
  icon: any;
  trend: string;
}