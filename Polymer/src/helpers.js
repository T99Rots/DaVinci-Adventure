let apiURL;
if((location.hostname === 'localhost' && location.port === '9001') || location.hostname !== 'localhost') {
  apiURL = location.protocol + '//' + location.host + '/api/';
} else {
  apiURL = location.protocol + '//' + location.hostname + ':9001/';
}

export { apiURL };

export const apiRequest = (url, options = {}) => {
  const requestUrl = new URL(url, apiURL);
  options = {
    ...options,
    headers: {
      'x-auth-token': localStorage.token,
      'x-auth-user': localStorage.userId,
      ...options.headers
    }
  }
  if(typeof options.body === 'object') {
    options.body = JSON.stringify(options.body);
    options.headers['Content-Type'] = 'application/json';
  }

  return fetch(requestUrl, options);
}