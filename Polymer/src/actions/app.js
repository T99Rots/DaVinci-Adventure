export const NAVIGATE = 'NAVIGATE';
export const UPDATE_PAGES = 'UPDATE_PAGES';

export const navigate = (page) => (dispatch) => {
	import(page.script);

	dispatch({
		type: NAVIGATE,
    pageId: page.id,
    params: page.params,
    searchParams: page.searchParams
	});

  dispatch(updateDrawerState(false));
  dispatch(updateCartState(false));
}

export const updatePages = (pages) => ({
  type: UPDATE_PAGES,
  pages
});