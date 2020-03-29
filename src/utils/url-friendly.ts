export const urlFriendly = (path: string) =>
  path
    .toString()
    .toLowerCase()
    .replace(/[^\w]/g, '-')
    .replace(/(\w)\W+$/, "\$1")
    .replace(/^\W+(\w)/, "\$1");
