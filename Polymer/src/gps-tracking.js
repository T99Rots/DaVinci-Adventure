const listeners = new Set();

let watchId = null;
let currentPosition;

export const watchLocation = (callback) => {
  if(typeof callback !== 'function') throw new Error('callback must be a function');
  if(listeners.size < 1) {
    watchId = navigator.geolocation.watchPosition(({ coords }) => {
      currentPosition = coords;
      listeners.forEach(listener => listener(coords));
    }, err => {
      console.warn(err);
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  } else {
    if(currentPosition) {
      callback(currentPosition);
    }
  }
  listeners.add(callback);
  return {
    destroy () {
      listeners.delete(callback);
      if(listeners.size < 1) {
        navigator.geolocation.clearWatch(watchId);
      }
    }
  };
}

const getDistanceBetweenCoords = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1);  // deg2rad below
  const dLon = deg2rad(lon2-lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c * 1000; // Distance in meter
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

export const inRangeWatcher = (
  {
    coords: {
      lat,
      lon
    },
    minTimeInRange = 2000, // min amount in time user needs to be in range before watcher triggers
    range = 10, // range in meters
    stopWatchingWhenInRange = true // when enabled will destroy the watcher as soon you the user has been in the range once
  } = {},
  callback
) => {
  if(typeof callback !== 'function') throw new Error('callback must be a function');
  if(typeof lat !== 'number' || typeof lon !== 'number') throw new Error('coords are missing or incomplete');


  let inRange = false;
  let timeout;

  const watcher = watchLocation((coords) => {
    const distance = getDistanceBetweenCoords(lat, lon, coords.latitude, coords.longitude);
    const newInRange = distance < range;
    if(newInRange !== inRange) {
      if(newInRange) {
        if(minTimeInRange > 0) {
          timeout = setTimeout(() => {
            if(stopWatchingWhenInRange) {
              watcher.destroy();
            }
            callback();
          }, minTimeInRange);
        } else {
          if(stopWatchingWhenInRange) {
            watcher.destroy();
          }
          callback();
        }
      } else {
        clearTimeout(timeout);
      }
      inRange = newInRange;
    }
  });

  return watcher;
}
