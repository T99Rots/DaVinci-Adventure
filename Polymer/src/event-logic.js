import { store } from './store';
import { setEventVisibility } from './actions/adventure';
import { inRangeWatcher } from './gps-tracking';

export const startAdventure = ({
  events,
  startTime
}) => {
  startTime = new Date(startTime).getTime();

  for(const event of events) {
    if(event.visibility !== 'visible') {
      for(const trigger of event.triggers) {
        if(trigger.type === 'time') {
          if(startTime + trigger.time < Date.now()) {
            store.dispatch(setEventVisibility(event._id, 'visible'));
          } else {
            setTimeout(() => {
              store.dispatch(setEventVisibility(event._id, 'visible'));
            }, (startTime + trigger.time) - Date.now());
          }
        } else if(trigger.type === 'location') {
          let visible = false;
          if(event.visibility !== 'on-map') {
            inRangeWatcher({
              coords: {
                lat: trigger.location.lat,
                lon: trigger.location.long
              },
              minTimeInRange: 2000,
              range: 40
            }, () => {
              if(!visible) {
                store.dispatch(setEventVisibility(event._id, 'on-map'));
              }
            });
          }
          inRangeWatcher({
            coords: {
              lat: trigger.location.lat,
              lon: trigger.location.long
            },
            minTimeInRange: 5000,
            range: 15
          }, () => {
            store.dispatch(setEventVisibility(event._id, 'visible'));
            visible = true;
          });
          // TODO: location trigger
        }
      }
    }
  }
}