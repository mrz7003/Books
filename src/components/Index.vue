<template>
  <div>
    <div style="margin-top: 20px; width: 100%">
      <span style="margin-left: 5%">欢迎 <span style="color: red">{{userName}}</span> 登录 <button class="logout_btn"
                                                                                               @click="logout()">注销</button></span>
      <span style="color: #67C23A;position: absolute;right: 1%">{{date}}<span
        style="margin-left: 10px">{{weekOfDay}}</span></span>
    </div>
    <el-container style="border: 1px solid #ee9a75;height:650px;">
      <el-aside width="200px" style="background-color: rgb(238, 244, 130)">
        <el-menu router :default-active="$route.path">
          <el-submenu v-for="(item,index) in menu" :index="index + ''">
            <template slot="title"><i class="el-icon-setting"></i>{{item.menuName}}</template>
            <el-menu-item v-for="item2 in item.secondaryMenu" :index="item2.menuUrl" v-model="menuUrl">
              {{item2.menuName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <router-view v-if="isRouterAlive"></router-view>
        </el-header>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    provide () {
      return {
        reload: this.reloads,
      }
    },
    data () {
      return {
        menuUrl: '',
        isRouterAlive: true,
        userName: '',
        date: '',
        day: 0,
        weekOfDay: '',
        menu: []
      }
    },
    //每隔一秒刷新一下主页面的时间
    mounted () {
      this.timer = setInterval(() => {
        this.date = this.$moment().format('YYYY年MM月DD日 hh点mm分ss秒')
        this.day = this.$moment().format('E')
      })
    },
    created () {
      // 手动刷新页面时 初始化sessionStorage的信息
      sessionStorage.setItem('currentPage', 0)
      sessionStorage.setItem('search', '')
      sessionStorage.setItem('operate', 'no')
      // 登录成功获取用户信息 主页用户名显示
      // 如果携带Cookie 则发送求情到后台请求解析Cookie并返回用户名 显示在主页
      this.$axios.get('http://localhost:8089/Users/LookUserContext').then((resp) => {
        sessionStorage.setItem('userId', resp.data.userId)
        this.userName = resp.data.userName
        this.$axios.get('http://localhost:8089/Menu/CheckMenu?userAuthority=' + resp.data.userAuthority).then((resp) => {
          this.menu = resp.data
        })
      })
    },
    //离开页面时销毁定时器
    beforeDestroy () {
      if (this.timer) {
        clearInterval(this.timer)
      }
    }
    ,
    watch: {
      // 监听日期是否改变
      day () {
        this.weekOfDay = this.conversion(this.day)
      }
    }
    ,
    methods: {
      reloads () {
        this.isRouterAlive = false
        this.$nextTick(() => {
          this.isRouterAlive = true
        })
      }
      ,
      // 用户注销登录
      logout () {
        this.$axios.get('http://localhost:8089/Users/Logout').then((resp) => {
          if (resp.data === 'success') {
            this.$router.push('/Login')
          }
        })
      }
      ,
      //转换日期
      conversion (day) {
        switch (parseInt(day)) {
          case 1:
            return '星期一'
          case 2:
            return '星期二'
          case 3:
            return '星期三'
          case 4:
            return '星期四'
          case 5:
            return '星期五'
          case 6:
            return '星期六'
          case 7:
            return '星期日'
          default:
            break
        }
      }
    },
  }
</script>

<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .logout_btn {
    color: red;
    background-color: transparent;
    border: 0px solid transparent;
    outline: none;
  }
</style>
