const apiURL = location.protocol + '//' + location.hostname + ':9001';

export const apiRequest = (url, options = {}) => {
  const requestUrl = new URL(url, apiURL);
  return fetch(requestUrl, {
    ...options,
    headers: {
      'x-auth-token': localStorage.token,
      'x-auth-user': localStorage.userId,
      ...options.headers
    }
  });
}