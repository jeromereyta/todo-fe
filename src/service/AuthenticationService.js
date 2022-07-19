import AxiosInstance from "@/service/AxiosInstance";

export default class AuthenticationService {
  authHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'))

    if (user?.accessToken) {
      return { Authorization: `Bearer ${user.accessToken}` }
    }

    return {}
  }

  login = user => AxiosInstance
    .post('login', {
      email: user.email,
      password: user.password,
    })
    .then(response => {
      if (response.data.access_token) {
        // eslint-disable-next-line no-param-reassign
        response.data.accessToken = response.data.access_token
        // eslint-disable-next-line no-param-reassign
        response.data.refreshToken = response.data.refresh_token

        localStorage.setItem('user', JSON.stringify(response.data))
      }

      return response.data
    })

  logout = () => {
    localStorage.removeItem('user')
  }
}
