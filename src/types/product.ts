export type IProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  qty: number;
  categoryId: number;
  isActive: true;
  category: {
    id: number;
    name: string;
  };
  productImages?: IProductImage[];
};

export interface IProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  fileName: string;
}
