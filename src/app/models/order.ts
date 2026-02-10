import { User } from './user';
import { OrderItem } from './order-item';

export enum Status {
    IsDraft = 'IsDraft',
    IsConfirmed = 'IsConfirmed'
}

export interface Order {
    id: number;
    orderDate: Date;
    status: Status;
    totalAmount: number;
    userId: number;
    user: User;
    orderItems: OrderItem[];
}

export interface OrderItemCreateDto {
  giftId: number;
  quantity: number;
}

export interface OrderItemResponseDto {
  giftId?: number; // מומלץ להוסיף ב-API כדי לזהות את הפריט למחיקה
  giftName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderResponseDto {
  id: number; // ודאי שה-API מחזיר ID עבור ה-PUT וה-DELETE
  userId: number;
  userName: string;
  totalAmount: number;
  status: string;
  orderDate: Date;
  orderItems: OrderItemResponseDto[];
}