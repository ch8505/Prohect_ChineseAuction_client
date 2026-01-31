// import { Category } from './category';
// import { Donor } from './donor';
// import { OrderItem } from './order-item';
// import { Winner } from './winner';

// // gift-base.model.ts
// export interface GiftBase {
//   name: string;
//   ticketPrice: number;
// }

// // gift.model.ts
// export interface Gift extends GiftBase {
//   id: number;
// }

// // gift-create-update.model.ts
// export interface GiftCreateUpdate extends GiftBase {
//   description?: string;
//   imageUrl?: string;
//   categoryId?: number;
//   // donorId?: number;
// }

// // gift-detail.model.ts
// export interface GiftDetail extends Gift {
//   description?: string;
//   imageUrl?: string;

//   categoryId?: number;
//   categoryName?: string;

//   donorId?: number;
//   donorName?: string;
//   donorEmail?: string;
// }

// export interface GiftAdmin extends GiftDetail {
//   purchasersCount: number;
// }

// export interface Buyer {
//   userName: string;
//   email: string;
//   quantity: number;
// }

// export interface GiftPurchases {
//   giftId: number;
//   giftName: string;
//   totalTicketsSold: number;
//   buyers: Buyer[];
// }


/* ========= Gift – תצוגה ========= */
export interface Gift {
  id: number;
  name: string;
  ticketPrice: number;

  description?: string;
  imageUrl?: string;

  categoryId?: number;
  categoryName: string;

  donorName?: string;
}

/* ========= GiftUpsert – יצירה / עדכון ========= */
export interface GiftUpsert {
  name: string;
  ticketPrice: number;
  description?: string;
  imageUrl?: string;
  categoryId?: number;
}

/* ========= Dropdowns ========= */
export interface Category {
  id: number;
  name: string;
}

export interface Donor {
  id: number;
  name: string;
}

