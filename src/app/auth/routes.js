const routes = {
  get: [
    {
      url: '/session',
      handler: 'getSession'
    }
  ],
  post: [
    {
      url: '/signup',
      handler: 'signup'
    },
    {
      url: '/login',
      handler: 'login'
    },
    {
      url: '/forgot-password',
      handler: 'forgotPassword'
    },
    {
      url: '/logout',
      handler: 'logout'
    }
  ],
  put: [
    {
      url: '/reset-password',
      handler: 'resetPassword'
    }
  ],
  del: []
}
export default routes
