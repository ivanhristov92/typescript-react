export type Country = {
  name: string;
};

export interface CountriesService {
  read(query?: string): Promise<Array<Country>>;
  readOne(name: string): Promise<Country>;
}
