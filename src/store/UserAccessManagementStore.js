import UserAccessManagementService from '@/service/UserAccessManagementService'

const userAccessManagementService = new UserAccessManagementService()
// eslint-disable-next-line import/prefer-default-export
export const UserAccessManagementStore = {
  namespaced: true,
  state: {
    loading: false,
    todos: [],
    todo: {},
    errors: [],
  },
  actions: {
    // eslint-disable-next-line no-shadow
    createUser({ commit }, user) {
      commit('setLoading', true)

      return userAccessManagementService.createUser(user)
        .then(
          // eslint-disable-next-line no-shadow,consistent-return
          user => {
            if (user.status !== undefined) {
              commit('setErrors', user.data)
            }

            return Promise.resolve(user)
          },
          error => {
            Promise.reject(error)
          },
        )
        .finally(() => {
          commit('setLoading', false)
        })
    },
    // eslint-disable-next-line no-shadow
    createTodo({ commit }, todo) {
      commit('setLoading', true)

      return userAccessManagementService.createTodo(todo)
        .then(
          // eslint-disable-next-line no-shadow
          todo => {
            if (todo.id !== undefined) {
              commit('addTodoSuccess', todo)
              commit('setErrors', {})
            }

            if (!todo.task) {
              commit('setErrors', todo.data)
            }

            return Promise.resolve(todo)
          },
          error => {
            Promise.reject(error)
          },
        )
        .finally(() => {
          commit('setLoading', false)
        })
    },
    // eslint-disable-next-line no-unused-vars
    deleteTodo({ commit }, todo) {
      commit('setLoading', true)

      return userAccessManagementService.deleteTodo(todo)
        .then()
        .finally(() => {
          commit('setLoading', false)
        })
    },
    getTodos({ commit }) {
      commit('setLoading', true)

      return userAccessManagementService.getTodos().then(
        users => {
          commit('fetchTodosSuccess', users.data)
          commit('setLoading', false)

          return Promise.resolve(users)
        },
        error => Promise.reject(error),
      )
    },
    getTodo({ commit }, todoId) {
      commit('setLoading', true)

      return userAccessManagementService.getTodo(todoId).then(
        user => {
          commit('fetchTodoSuccess', user.data)
          commit('setLoading', false)

          return Promise.resolve(user)
        },
        error => Promise.reject(error),
      )
    },
    logout({ commit }) {
      return userAccessManagementService.logout().then(
        () => {
          commit('loggedOut')
        },
      )
    },
    removeErrors({ commit }) {
      commit('setErrors', {})
    },
    updateTodo({ commit }, todo) {
      commit('setLoading', true)

      return userAccessManagementService.updateTodo(todo)
        .then(
          // eslint-disable-next-line no-shadow
          todo => {
            commit('updateTodoSuccess', todo)
            commit('setLoading', false)

            return Promise.resolve(todo)
          },
          error => Promise.reject(error),
        )
    },

  },
  mutations: {
    loggedOut() {
      localStorage.removeItem('user')
    },
    setErrors(state, errors) {
      state.errors = errors
    },
    setLoading(state, loading) {
      state.loading = loading
    },
    addTodoSuccess(state, todo) {
      state.todos.push(todo)
    },
    fetchTodosSuccess(state, todos) {
      state.todos = todos
    },
    fetchTodoSuccess(state, todo) {
      state.todo = todo
    },
    updateTodoSuccess(state, todo) {
      const index = state.todos.findIndex(value => value.id === todo.id)
      state.todos[index] = todo
    },
    deleteTodoSuccess(state, todo) {
      const index = state.todos.findIndex(value => value.id === todo.id)
      state.todos.splice(index, 1)
    },
  },
}
