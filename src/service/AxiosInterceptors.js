import TokenService from '@/service/TokenService'
import AxiosInstance from '@/service/AxiosInstance'

const AxiosInterceptors = store => {
  let isRefreshing = false
  let failedQueue = []

  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve(token)
      }
    })

    failedQueue = []
  }

  AxiosInstance.interceptors.request.use(config => {
    const token = TokenService.getLocalAccessToken()
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error))
  AxiosInstance.interceptors.response.use(
    res => res,
    async err => {
      const originalConfig = err.config

      if ((originalConfig.url !== '/login' && originalConfig.url !== '/refresh-token') && err.response) {
        // eslint-disable-next-line no-underscore-dangle
        if (err.response.status === 401 && !originalConfig._retry) {
          if (isRefreshing) {
            return new Promise(((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })).then(token => {
              originalConfig.headers.Authorization = `Bearer ${token}`

              return AxiosInstance(originalConfig)
              // eslint-disable-next-line no-shadow
            }).catch(err => Promise.reject(err))
          }

          // eslint-disable-next-line no-underscore-dangle
          originalConfig._retry = true
          isRefreshing = true

          try {
            const rs = await AxiosInstance.post('/refresh-token', {
              refreshToken: TokenService.getLocalRefreshToken(),
            })
            const { accessToken } = rs.data
            store.dispatch('AuthStore/refreshToken', accessToken)
            TokenService.updateLocalAccessToken({ token: accessToken })
            processQueue(null, accessToken)

            return AxiosInstance(originalConfig)
          } catch (_error) {
            processQueue(err, null)
            store.dispatch('AuthStore/logout')
            window.location.href = '/pages/login'

            return Promise.reject(_error)
          } finally {
            isRefreshing = true
          }
        }
      }

      return Promise.reject(err)
    },
  )
}
export default AxiosInterceptors
