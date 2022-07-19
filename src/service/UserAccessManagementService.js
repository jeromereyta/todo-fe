import AxiosInstance from '@/service/AxiosInstance'

export default class UserAccessManagementService {
  createUser = user => AxiosInstance.post('/register', user)
    .then(response => response.data)
    .catch(error => error.response)

  createTodo = todo => AxiosInstance.post('/todos', todo)
    .then(response => response.data)
    .catch(error => error.response)

  deleteTodo = todo => AxiosInstance.delete(`todos/${todo.id}`, todo)
    .then(response => response.data)
    .catch(error => error.response)

  getTodos = () => AxiosInstance.get('/todos')
    .then(response => response.data)
    .catch(error => error.response)

  getTodo = todoId => AxiosInstance.get(`/todos/${todoId}`)
    .then(response => response.data)
    .catch(error => error.response)

  logout = () => AxiosInstance.post('/logout')
    .then(response => response.data)
    .catch(error => error.response)

  updateTodo = todo => AxiosInstance.put(`todos/${todo.id}`, todo)
    .then(response => response.data)
    .catch(error => error.response)
}
