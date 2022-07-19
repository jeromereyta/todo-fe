import { reactive } from '@vue/composition-api'
import router from './index'

const currentRoute = reactive({
  ...router.currentRoute,
})

router.beforeEach((to, from, next) => {
  Object.keys(to).forEach(key => {
    currentRoute[key] = to[key]
  })
  next()
})

// eslint-disable-next-line import/prefer-default-export
export function useRoute() {
  console.log('test')
  return currentRoute
}
