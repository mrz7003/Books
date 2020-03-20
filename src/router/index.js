import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import Login from '../components/Login'
import Index from '../components/Index'
import Register from '../components/Register'
import ForgetCode from '../components/ForgetCode'
import BooksCharts from '../components/admin/charts/BooksCharts'
import UsersCharts from '../components/admin/charts/UsersCharts'
import BooksAll from '../components/admin/books/BooksAll'
import BooksAdd from '../components/admin/books/BooksAdd'
import BooksEdit from '../components/admin/books/BooksEdit'
import CategoriesAll from '../components/admin/books/CategoriesAll'
import UsersAll from '../components/admin/users/UsersAll'
import UsersParticulars from '../components/admin/users/UsersParticulars'
import BorrowBooks from '../components/ordinary/books/BorrowBooks'
import MyBooks from '../components/ordinary/books/MyBooks'
import PersonageMessage from '../components/ordinary/users/PersonageMessage'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'App',
      component: App,
      children: [
        {
          path: '/Login',
          name: '用户登录',
          component: Login
        },
        {
          path: '/Register',
          name: '用户注册',
          component: Register
        },
        {
          path: '/ForgetCode',
          name: '忘记密码',
          component: ForgetCode
        },
      ]
    },
    {
      path: '/Index',
      name: '主页',
      component: Index,
    },
    {
      path: '/Admin/Charts',
      name: '数据展示',
      component: Index,
      children: [
        {
          path: '/Charts/BooksCharts',
          name: '书籍信息',
          component: BooksCharts
        },
        {
          path: '/Charts/UsersCharts',
          name: '用户信息',
          component: UsersCharts
        }
      ]
    },
    {
      path: '/Admin/Books',
      name: '书籍管理',
      component: Index,
      children: [
        {
          path: '/Books/BooksAll',
          name: '全部书籍',
          component: BooksAll
        },
        {
          path: '/Books/BooksAdd',
          name: '添加书籍',
          component: BooksAdd
        },
        {
          path: '/Books/BooksEdit',
          name: '修改书籍',
          component: BooksEdit
        }
      ]
    },
    {
      path: '/Admin/Category',
      name: '类别管理',
      component: Index,
      children: [
        {
          path: '/Category/CategoriesAll',
          name: '全部类别',
          component: CategoriesAll
        }
      ]
    },
    {
      path: '/Admin/Users',
      name: '用户管理',
      component: Index,
      children: [
        {
          path: '/Users/UsersAll',
          name: '全部用户',
          component: UsersAll
        },
        {
          path: '/Users/UsersParticulars',
          mame: '详细信息',
          component: UsersParticulars
        }
      ]
    },
    {
      path: '/Ordinary/Books',
      name: '我的书籍',
      component: Index,
      children: [
        {
          path: '/Books/BorrowBooks',
          name: '借阅书籍',
          component: BorrowBooks
        },
        {
          path: '/Books/MyBooks',
          name: '我的书籍',
          component: MyBooks
        }
      ]
    },
    {
      path: '/Ordinary/Users',
      name: '个人信息',
      component: Index,
      children: [
        {
          path: '/Users/PersonageMessage',
          name: '我的信息',
          component: PersonageMessage
        }
      ]
    },
  ]
})
