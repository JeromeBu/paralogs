import { RequireField } from "@paralogs/shared";

export type Persisted<T extends { id?: number }> = RequireField<T, "id">;
