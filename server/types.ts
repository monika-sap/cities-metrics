export interface City {
  name: string;
  area: number;
  population: number;
}

export interface EnrichedCity extends City {
  density: number;
}

export interface CitiesQueryParams {
  fileType?: string;
  fileName?: string;
  sort?: SortField;
  order?: SortDirection;
  nameContains?: string;
}

export enum SortDirection {
  ASC,
  DESC,
}

export const sortableFields = ["name", "area", "population"] as const;
export type SortField = (typeof sortableFields)[number];
