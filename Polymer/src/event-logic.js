import { store } from './store';
import { setEventVisibility } from './actions/adventure';

export const startAdventure = ({
  events,
  startTime
}) => {
  startTime = new Date(startTime).getTime();

  console.log(events);

  for(const event of events) {
    if(!event.visible) {
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
          // TODO: location trigger
        }
      }
    }
  }
}