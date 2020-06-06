type EnumFromArray<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

export const throwIfNotInArray = <T extends string>(
  authorizedValues: T[],
  variableName: string,
): T => {
  if (!authorizedValues.includes(process.env[variableName] as T))
    throw new Error(
      `${variableName} to be one of : ${authorizedValues.join("|")}, got : ${
        process.env[variableName]
      }`,
    );
  return process.env[variableName] as EnumFromArray<typeof authorizedValues>;
};

export const throwIfVariableUndefined = (variableName: string) => {
  const variableValue = process.env[variableName];
  if (!variableValue)
    throw new Error(`Environnement variable : ${variableName} was not set`);
  return variableValue;
};
