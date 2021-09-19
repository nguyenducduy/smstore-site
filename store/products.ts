export const state = () => ({
  pageSize: 20,
})

export const mutations = {
  SET_PAGE_SIZE(state, pageSize) {
    state.pageSize = pageSize
  }
}

export const actions = {
  
};

export const getters = {
  pageSize(state) {
    return state.pageSize
  }
};