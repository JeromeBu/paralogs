export const findAndReplace = <T>(
  arrayToSearch: T[],
  newValue: T,
  condition: (val: T) => boolean,
): T[] => {
  const indexToReplace = arrayToSearch.findIndex(condition);
  return Object.assign([], arrayToSearch, { [indexToReplace]: newValue });
};

export const findByUuidAndReplace = <T extends { uuid: string }>(
  arrayToSearch: T[],
  newValue: T,
): T[] => {
  const indexToReplace = arrayToSearch.findIndex(
    (item) => item.uuid === newValue.uuid,
  );
  if (indexToReplace === -1) return arrayToSearch;
  return Object.assign([], arrayToSearch, { [indexToReplace]: newValue });
};
