interface Flavoring<FlavorT> {
  _type?: FlavorT;
}

export type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;

export type NumberOfMinutes = Flavor<number, "NumberOfMinutes">;

export type DateString = string /* as UTC string */;

export type StringError = Flavor<string, "error">;

export type RequireField<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;
