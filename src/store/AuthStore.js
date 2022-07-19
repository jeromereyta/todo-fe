import AuthenticationService from '../service/AuthenticationService'

const authenticationService = new AuthenticationService()

const user = JSON.parse(localStorage.getItem('user'))

const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null }

// eslint-disable-next-line import/prefer-default-export
export const AuthStore = {
  namespaced: true,
  state: initialState,
  actions: {
    // eslint-disable-next-line no-shadow
    login({ commit }, user) {
      return authenticationService.login(user)
        .then(
          // eslint-disable-next-line no-shadow
          user => {
            commit('loginSuccess', user)

            return Promise.resolve(user)
          },
          error => {
            commit('loginFailure')

            return Promise.reject(error)
          },
        ).catch(error => Promise.reject(error.response))
    },
    refreshToken({ commit }, accessToken) {
      commit('refreshToken', accessToken)
    },
    logout({ commit }) {
      authenticationService.logout()
      commit('logout')
    },
  },
  mutations: {
    // eslint-disable-next-line no-shadow
    loginSuccess(state, user) {
      state.status.loggedIn = true
      state.user = user
    },
    loginFailure(state) {
      state.status.loggedIn = false
      state.user = null
    },
    logout(state) {
      state.status.loggedIn = false
      state.user = null
    },
    refreshToken(state, accessToken) {
      state.status.loggedIn = true
      state.user = { ...state.user, access_token: accessToken }
    },
    registerSuccess(state) {
      state.status.loggedIn = false
    },
    registerFailure(state) {
      state.status.loggedIn = false
    },
  },
}
