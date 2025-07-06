export default defineNuxtRouteMiddleware(to => {
  const {
    public: { isAdmin },
  } = useRuntimeConfig();

  if (isAdmin?.toString() !== 'true' && to.path !== '/') {
    return navigateTo('/');
  }
});
