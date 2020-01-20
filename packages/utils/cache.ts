const namespace = 'KERBEROS';

export const setCache = (key: string, value: any): void => {
  if (!(window as any)[namespace]) {
    (window as any)[namespace] = {};
  }
  (window as any)[namespace][key] = value;
};

export const getCache = (key: string): any => {
  const cache: any = (window as any)[namespace];
  return cache && cache[key] ? cache[key] : null;
};
