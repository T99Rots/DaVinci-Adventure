import { createSelector } from 'reselect';

import {
  GET_TEMPLATES,
  GET_TEMPLATES_FAILED,
  UPDATE_BOTTOM_SHEET,
  UPDATE_SELECTED_TEMPLATE
} from '../actions/templates';

const initialState = {
  templates: [],
  templatesError: '',
  initialized: false,
  bottomSheetOpened: false,
  selectedTemplate: ''
}

const templates = (state = initialState, action) => {
  switch(action.type) {
    case GET_TEMPLATES:
      return {
        ...state,
        templates: action.templates,
        initialized: true
      };
    case GET_TEMPLATES_FAILED:
      return {
        ...state,
        templatesError: action.error
      };
    case UPDATE_BOTTOM_SHEET:
      return {
        ...state,
        bottomSheetOpened: action.opened
      };
    case UPDATE_SELECTED_TEMPLATE:
      return {
        ...state,
        bottomSheetOpened: true,
        selectedTemplate: action.template
      };
    default:
      return state;
  }
}

export default templates;

export const selectedTemplateSelector = createSelector(
  state => state.templates.templates,
  state => state.templates.selectedTemplate,
  (templates, selectedTemplate) => templates.find(template => template._id === selectedTemplate)
);