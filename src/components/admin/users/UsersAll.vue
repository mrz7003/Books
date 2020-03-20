<template>
  <div style="height:650px; position: relative">
    <el-container style="border: 1px solid #eee">
      <el-header style="text-align: center; font-size: 16px">
        <i class="el-icon-s-home" style="margin-right: 15px"></i>
        <span>用户信息展示</span>
      </el-header>
    </el-container>
    <el-table :data="tableData" style="width: 100%;" border>
      <el-table-column label="用户编号" prop="userId" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户名" prop="userName" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户密码" prop="userCode" show-overflow-tooltip></el-table-column>
      <el-table-column label="手机号码" prop="userPhone" show-overflow-tooltip></el-table-column>
      <el-table-column align="right" width="300px">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入用户名关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <span style="color: red;font-size: larger" v-if="scope.row.userAuthority">该用户是超级管理员！</span>
          <el-button size="mini" type="primary" @click="userParticulars(scope.row)" v-if="!(scope.row.userAuthority)">
            详细信息
          </el-button>
          <el-button size="mini" :type="scope.row.userSign?'info':'success'" @click="userSign(scope.row)"
                     v-if="!(scope.row.userAuthority)">
            {{scope.row.userSign?'封禁':'解封'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="position: absolute; left: 40%; top: 610px" background
                   layout="prev, pager, next" :page-size="pageSize"
                   :total="total" @current-change="page">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'BooksQuery',
    inject: ['reload'],
    data () {
      return {
        //每页展示8条数据
        pageSize: 8,
        total: 0,
        search: '',
        //用于删除弹出框传参使用
        bookId: '',
        bookName: '',
        dialogVisible: false,
        tableData: []
      }
    },
    created () {
      //初始化第一页
      this.$axios.get('http://localhost:8089/Users/UsersQuery?pageNum=' + 0 + '&pageSize=' + this.pageSize + '&searchUser=' + this.search).then((resp) => {
        this.tableData = resp.data.list
        this.total = resp.data.total
      })
    },
    methods: {
      //用户分页查询
      page (pageNum) {
        this.$axios.get('http://localhost:8089/Users/UsersQuery?pageNum=' + pageNum + '&pageSize=' + this.pageSize + '&searchUser=' + this.search).then((resp) => {
          this.tableData = resp.data.list
          this.total = resp.data.total
        })
      },
      //跳转到详细信息页面
      userParticulars (row) {
        this.$router.push({path: '/Users/UsersParticulars', query: {userId: row.userId}})
      },
      //用户封禁解封操作
      userSign (row) {
        if (row.userSign) {
          this.$axios.put('http://localhost:8089/Users/UsersEditSign', this.$qs.stringify({
            userId: row.userId,
            userSign: false
          })).then((resp) => {
            if (resp.data === 'success') {
              this.reload()
              this.$message({type: 'warning', message: '封禁成功!'})
            } else {
              this.$message({type: 'error', message: '封禁失败!'})
            }
          })
        } else {
          this.$axios.put('http://localhost:8089/Users/UsersEditSign', this.$qs.stringify({
            userId: row.userId,
            userSign: true
          })).then((resp) => {
            if (resp.data === 'success') {
              this.reload()
              this.$message({type: 'success', message: '解封成功!'})
            } else {
              this.$message({type: 'error', message: '解封失败!'})
            }
          })
        }
      },
    },
    watch: {
      search () {
        //搜索动态模糊查询
        this.$axios.get('http://localhost:8089/Users/UsersQuery?pageNum=' + 0 + '&pageSize=' + this.pageSize + '&searchUser=' + this.search).then((resp) => {
          this.tableData = resp.data.list
          this.total = resp.data.total
        })
      }
    }
  }
</script>

<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>
