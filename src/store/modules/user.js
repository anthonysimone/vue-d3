import auth from '@/firebase/auth/index'

const state = {
  user: null,
  userProfile: null
}

const getters = {
  user: state => state.user,
  userProfile: state => state.userProfile,
  isLogged: state => (state.user !== null)
}

const mutations = {
  setUser: (state, user) => {
    state.user = user
  },
  setUserProfile: (state, userProfile) => {
    state.userProfile = userProfile
  },
  updateUserProfile: (state, updatedUserProfile) => {
    Object.assign(state.userProfile, updatedUserProfile)
  }
}

const actions = {
  setCurrentUser: ({ commit }) => {
    commit('setUser', auth.user())
  },
  setCurrentUserProfile: ({ commit }, userProfile) => {
    commit('setUserProfile', userProfile)
  },
  updateCurrentUserProfile: ({ commit }, updatedUserProfile) => {
    commit('updateUserProfile', updatedUserProfile)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
