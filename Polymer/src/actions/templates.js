import { apiRequest } from '../helpers';
import { updateLoading } from './app';

export const GET_TEMPLATES = 'GET_TEMPLATES';
export const GET_TEMPLATES_FAILED = 'GET_TEMPLATES_FAILED';
export const UPDATE_SELECTED_TEMPLATE = 'UPDATE_SELECTED_TEMPLATE';
export const UPDATE_BOTTOM_SHEET = 'UPDATE_BOTTOM_SHEET';

const errors = {
  GET_TEMPLATES_FAILED: 'Er is een fout opgetreden bij het ophalen van de templates.'
}

export const getTemplates = () => async (dispatch) => {
  try {
    dispatch(updateLoading(true));
    const res = await apiRequest('templates');
    dispatch(updateLoading(false));
    if(res.status >= 200 && res.status < 300) {
      dispatch({
        type: GET_TEMPLATES,
        templates: (await res.json()).map(template => ({
          ...template,
          dateCreated: new Date(template.dateCreated)
        }))
      });
    } else {
      dispatch({
        type: GET_TEMPLATES_FAILED,
        error: (await res.json()).message
      })
    }
  } catch(err) {
    dispatch(updateLoading(false));
      dispatch({
      type: GET_TEMPLATES_FAILED,
      error: errors.GET_TEMPLATES_FAILED
    });
  }
}

export const updateSelectedTemplate = (id) => ({
  type: UPDATE_SELECTED_TEMPLATE,
  template: id
})

export const updateBottomSheet = (opened) => ({
  type: UPDATE_BOTTOM_SHEET,
  opened
});