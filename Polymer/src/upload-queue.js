import { apiRequest } from './helpers'

const uploadQueue = async () => {
  const queueStr = localStorage.answerQueue;
  if(queueStr) {
    const queue = JSON.parse(queueStr);
    if(queue.length > 0) {
      const events = JSON.parse(localStorage.events);
      
      const answers = events.filter(e => queue.includes(e._id)).map(e => ({
        questionId: e._id,
        answer: e.answer
      }));
  
      try {
        await apiRequest('adventure/update-answer', {
          method: 'POST',
          body: answers
        });
        delete localStorage.answerQueue;
      } catch(e) {
        setTimeout(() => {
          if(navigator.onLine) {
            uploadQueue();
          }
        }, 1000*60);
      }
    }
  }
}

if(navigator.onLine) uploadQueue();

window.addEventListener('online',  uploadQueue)