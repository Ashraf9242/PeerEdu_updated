
export type SearchParams = {
  q?: string;
  university?: string;
  subjects?: string;
  minPrice?: string;
  maxPrice?:string;
  rating?: string;
  sort?: 'rating' | 'price' | 'experience';
  page?: string;
};
