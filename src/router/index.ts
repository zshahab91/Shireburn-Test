import { createRouter, createWebHistory } from 'vue-router'
import EmployeesView from '../views/EmployeesView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/employees',
      name: 'employees',
      component: EmployeesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/employees/:id',
      name: 'employee-profile',
      component: () => import('@/components/EmployeeProfile.vue'),
      meta: { requiresAuth: true },
      props: (route) => ({ mode: 'view' }),
    },
    {
      path: '/employees/:id/edit',
      name: 'employee-edit',
      component: () => import('@/components/EmployeeProfile.vue'),
      meta: { requiresAuth: true },
      props: (route) => ({ mode: 'edit' }),
    },
    {
      path: '/employees/create',
      name: 'employee-create-mobile',
      component: () => import('@/components/MobileEmployeeForm.vue'),
      props: { isEditMode: false },
      meta: { requiresAuth: true },
    },
    {
      path: '/employees/:id/edit-mobile',
      name: 'employee-edit-mobile',
      component: () => import('@/components/MobileEmployeeForm.vue'),
      props: { isEditMode: true },
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user')

  if (to.meta.requiresAuth && !user) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/signup') && user) {
    next('/employees')
  } else {
    next()
  }
})

export default router
