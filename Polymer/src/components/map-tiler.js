import { LitElement, html, css } from 'lit-element';
import 'mapbox-gl/dist/mapbox-gl-dev.js';
import 'bezier-easing/dist/bezier-easing'

mapboxgl.setRTLTextPlugin(
  'https://cdn.maptiler.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.2/mapbox-gl-rtl-text.js'
);

class MapTiler extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
      }

      #map {
        flex-grow: 1;
      }

      #user-marker {
        background: rgb(0,127,255);
        border: 3px solid white;
        box-shadow: 0px 0px 6px rgba(0,0,0,0.5);
        width: 16px;
        height: 16px;
        border-radius: 50%;
        position: relative;
      }

      #user-marker::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        background: rgba(0,127,255,0.35);
        animation: pulse 1.5s ease-out infinite;
        /* transform: scale(1); */
        /* opacity: 1; */
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        70% {
          transform: scale(5);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 0;
        }
      }
    `;
  }

  render() {
    return html`
      <div id='map'></div>
    `;
  }

  firstUpdated() {
    this._map = new mapboxgl.Map({
      container: this.renderRoot.getElementById('map'),
      style:
        'https://api.maptiler.com/maps/streets/style.json?key=mPMeIWndEBcKZ4KNhLyD',
      center: [4.68144, 51.79898],
      zoom: 16.5,
      maxZoom: 19,
      minZoom: 15
    });
    this._map.on('load', () => {
      const markerElem = document.createElement('div');
      markerElem.id = 'user-marker';
      markerElem.setAttribute('hidden', '');

      const userMarker = new mapboxgl.Marker(markerElem).setLngLat([0, 0]).addTo(this._map);

      const getMidPoint = ([long1, lat1], [long2, lat2], per) => {
        return [long1 + (long2 - long1) * per, lat1 + (lat2 - lat1) * per];
      }

      const easing = BezierEasing(.5, 0, .5, 1);

      const moveMarker = (pos1, pos2, marker, time = 500) => {
        const startTime = Date.now();
        const loop = () => {
         const timePassed = Date.now() - startTime;
          if(timePassed < time) {
            marker.setLngLat(getMidPoint(pos1, pos2, easing(timePassed / time)));
            requestAnimationFrame(() => loop());
          } else {
            marker.setLngLat(pos2);
          }
        }
        loop();
      }

      let firstPosition = true;
      let oldCords;
      const updateLocation = () => {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            setTimeout(() => updateLocation(), 500);
            this._coords = coords;
            if(firstPosition) {
              userMarker.setLngLat([coords.longitude, coords.latitude]);
              oldCords = [coords.longitude, coords.latitude];
              firstPosition = false;
            } else {
              moveMarker(oldCords, [coords.longitude, coords.latitude], userMarker);
              oldCords = [coords.longitude, coords.latitude];
            }
            markerElem.removeAttribute('hidden');
          },
          err => {
            setTimeout(() => updateLocation(), 500);
            console.warn('failed getting position', err);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 1
          }
        );
      };
      updateLocation();
    });
  }

  focusOnUserLocation() {
    if (!this._coords) return;
    this._map.easeTo({
      center: {
        lon: this._coords.longitude,
        lat: this._coords.latitude
      },
      zoom: 16.5,
      pitch: 0
    });
  }

  static get properties() {
    return {
      selected: { type: String }
    };
  }
}

window.customElements.define('map-tiler', MapTiler);
