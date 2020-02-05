import { LitElement, html, css } from 'lit-element';
import 'mapbox-gl/dist/mapbox-gl.js';
import 'bezier-easing/dist/bezier-easing'
import { watchLocation } from '../gps-tracking'

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

      .marker {
        width: 20px;
        height: 20px;
      }

      .marker > div {
        width: 14px;
        height: 14px;
        box-shadow: 0px 0px 6px rgba(0,0,0,0.5);
        background: white;
        border: 3px solid white;
        border-radius: 50%;
        color: black;
        cursor: pointer;
        position: relative;
        transform-style: preserve-3d;
        z-index: 1;
      }

      .marker > div::before {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        content: '';
        color: inherit;
      }

      .marker[visibility="on-map"] > div::before {
        content: '?';
      }

      .marker[visibility="visible"].question > div::before {
        content: '?';
      }

      .marker[visibility="visible"].info > div::before {
        content: 'I';
      }

      .pulse::before, [visibility="on-map"]::after {
        z-index: -1;
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        animation: pulse 1.5s ease-out infinite;
        background: rgba(0,0,0,0.25);
        transform: translateZ(-1px);
      }

      #user-marker > div {
        background: rgb(0,127,255);
        /* pointer-events: none; */
        cursor: default;
      }

      #user-marker::before {
        background: rgba(0,127,255,0.35);
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
      // minZoom: 15
    });
    this._map.on('load', () => {
      const markerElem = document.createElement('div');
      markerElem.id = 'user-marker';
      markerElem.setAttribute('hidden', '');
      markerElem.className = 'pulse marker';
      markerElem.appendChild(document.createElement('div'));

      const userMarker = new mapboxgl.Marker(markerElem).setLngLat([0, 0]).addTo(this._map);

      const getMidPoint = ([long1, lat1], [long2, lat2], per) => {
        return [long1 + (long2 - long1) * per, lat1 + (lat2 - lat1) * per];
      }
      
      const easing = BezierEasing(.5, 0, .5, 1);
      let startTime;
      let lastPoint = [0,0];
      let startPoint = [0,0];
      let endPoint = [0,0];
      let animationOngoing = false;

      const moveMarker = (pos1, pos2, marker, time = 500) => {
        startTime = Date.now();
        if(animationOngoing) {
          startPoint = lastPoint;
          endPoint = pos2;
        } else {
          animationOngoing = true;
          startPoint = pos1;
          endPoint = pos2;
          const loop = () => {
           const timePassed = Date.now() - startTime;
            if(timePassed < time) {
              lastPoint = getMidPoint(startPoint, endPoint, easing(timePassed / time));
              marker.setLngLat(lastPoint);
              requestAnimationFrame(() => loop());
            } else {
              marker.setLngLat(endPoint);
              animationOngoing = false;
            }
          }
          loop();
        }
      }

      let firstPosition = true;
      let oldCords;
      watchLocation((coords) => {
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
      });

      this._addArea();
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

  constructor() {
    super();
    this._markers = {};
    this._areaAdded = false;
  }

  static get properties() {
    return {
      events: { type: Array },
      area: { type: Array }
    };
  }
  
  _addArea() {
    if(!this._areaAdded && this.area.length > 0 && this._map._loaded) {
      this._areaAdded = true;
      this._map.addSource('maine', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              this.area.map(a => a.reverse())
            ]
          }
        }
      });
      this._map.addLayer({
        'id': 'maine',
        'type': 'line',
        'source': 'maine',
        'layout': {},
        'paint': {
          'line-color': '#45a086',
          'line-width': 4
        }
      });
    }
  }

  update(changedProps) {
    if(changedProps.has('events')) {
      for(const event of this.events) {
        if(event.visibility) {
          const locationTrigger = event.triggers.find(t => t.type === 'location');
          if(locationTrigger) {
            let marker = this._markers[event._id];
            if(!marker) {
              marker = document.createElement('div');
              marker.appendChild(document.createElement('div'));
              marker.className = `event marker ${event.type}`;
              this._markers[event._id] = marker;
              marker.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('marker-clicked', { detail: event }));
              });
              new mapboxgl.Marker(marker).setLngLat([
                locationTrigger.location.long,
                locationTrigger.location.lat
              ]).addTo(this._map);
            }
            marker.setAttribute('visibility', event.visibility);
          }
        }
      }
    }
    if(changedProps.has('area')) this._addArea();
    super.update(changedProps);
  }
}

window.customElements.define('map-tiler', MapTiler);
