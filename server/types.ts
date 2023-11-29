export interface City {
  name: string;
  area: number;
  population: number;
}

export interface EnrichedCity extends City {
  density: number;
}

export enum SortDirection {
  ASC,
  DESC,
}

export const sortableFields = ["name", "area", "population"] as const;
export type SortField = (typeof sortableFields)[number];
