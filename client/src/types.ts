export interface City {
  name: string;
  area: number;
  population: number;
}

export interface EnrichedCity extends City {
  density: number;
}