import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表盘', icon: 'dashboard' }
    }]
  },

  {
    path: '/private',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/private/index'),
        meta: { title: '私人空间', icon: 'form' }
      }
    ]
  },

  {
    path: '/group',
    component: Layout,
    redirect: '/group/create',
    name: 'Group',
    meta: { title: '小组空间', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'create',
        name: 'Create',
        component: () => import('@/views/group/create/index'),
        meta: { title: '创建小组', icon: 'table' }
      },
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/group/list/index'),
        meta: { title: '小组列表', icon: 'tree' }
      }
    ]
  },
  {
    path: '/public',
    component: Layout,
    redirect: '/public/publish',
    name: 'Public',
    meta: {
      title: '公共空间',
      icon: 'nested'
    },
    children: [
      {
        path: 'publish',
        component: () => import('@/views/public/publish/index'), // Parent router-view
        name: 'publish',
        meta: { title: '我的发布' }
      },
      {
        path: 'search',
        component: () => import('@/views/public/search/index'),
        name: 'Search',
        meta: { title: '查找文件' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
