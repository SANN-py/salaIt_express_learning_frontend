// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface ICategory {
  id: number;
  name: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}
