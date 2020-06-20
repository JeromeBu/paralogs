import { RequireField } from "@paralogs/shared/common";

export type Persisted<T extends { id?: number }> = RequireField<T, "id">;
