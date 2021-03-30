/* eslint-disable implicit-arrow-linebreak */
export const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
export const initToUpper = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1);
// export const serverHttp = 'http://61.75.4.217:8081';
export const serverHttp = process.env.SERVER_URL;
