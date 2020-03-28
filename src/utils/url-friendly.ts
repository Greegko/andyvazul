export const urlFriendly = (path: string | number) => path.toString().toLowerCase().replace(/[^\w]/g, '-');
