import { createSelector } from 'reselect';

import {
  NAVIGATE,
  UPDATE_PAGES,
  UPDATE_LOADING,
  UPDATE_DRAWER
} from '../actions/app';

const initialState = {
	pages: [{
    id: 'INITIAL_PAGE',
    title: 'Loading...'
  }],
  page: 'INITIAL_PAGE',
  appLoading: false,
  drawerOpened: false
}

const app = (state = initialState, action) => {
	switch(action.type) {
    case NAVIGATE:
      return {
        ...state,
        page: action.pageId,
        pages: state.pages.map((page) => {
          if (page.id === action.pageId) {
            return {
              ...page,
              params: action.params,
              searchParams: action.searchParams
            };
          }
          return page;
        })
      };
    case UPDATE_PAGES:
      return {
        ...state,
        pages: action.pages
      };
    case UPDATE_LOADING:
      return {
        ...state,
        appLoading: action.loading
      }
    case UPDATE_DRAWER:
      return {
        ...state,
        drawerOpened: action.opened
      }
		default:
			return state;
	}
}

export default app;

export const activePageSelector = createSelector(
  state => state.app.pages,
  state => state.app.page,
  (pages, pageId) => pages.find(page => page.id === pageId) || pages[0]
);

export const pageSelector = customPageId => createSelector(
  state => state.app.pages,
  state => state.app.page,
  (pages, pageId) => pages.find(page => page.id === (customPageId || pageId)) || pages[0]
);