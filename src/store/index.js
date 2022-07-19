import Vue from 'vue'
import Vuex from 'vuex'
import { AuthStore } from '@/store/AuthStore'
import { UserAccessManagementStore } from '@/store/UserAccessManagementStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    AuthStore,
    UserAccessManagementStore,
  },
})
