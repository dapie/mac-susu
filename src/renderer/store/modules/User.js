const state = {
  accessToken: ''
}

const mutations = {
  SET_TOKEN (state, token) {
    state.accessToken = token
  }
}

const actions = {
  setToken ({ commit, token }) {
    // do something async
    commit('SET_TOKEN', token)
  }
}

export default {
  state,
  mutations,
  actions
}
