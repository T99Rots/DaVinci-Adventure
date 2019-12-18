export const NAVIGATE = 'NAVIGATE';
export const UPDATE_PAGES = 'UPDATE_PAGES';
export const UPDATE_LOADING = 'UPDATE_LOADING';

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

export const updateLoading = (loading) => ({
  type: UPDATE_LOADING,
  loading
});