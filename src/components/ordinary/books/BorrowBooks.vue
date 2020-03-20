<template>
  <div>
    <el-container style="border: 1px solid #eee">
      <el-header style="text-align: center; font-size: 16px">
        <i class="el-icon-s-home" style="margin-right: 15px"></i>
        <span>图书借阅</span>
      </el-header>
    </el-container>
    <el-table :data="tableData" style="width: 100%;" border>
      <el-table-column label="类别" prop="categoryName" show-overflow-tooltip></el-table-column>
      <el-table-column label="图书名称" prop="bookName" show-overflow-tooltip></el-table-column>
      <el-table-column label="图书作者" prop="bookAuthor" show-overflow-tooltip></el-table-column>
      <el-table-column label="库存" prop="bookInventory" show-overflow-tooltip></el-table-column>
      <el-table-column label="出版社" prop="publishingHouse" show-overflow-tooltip></el-table-column>
      <el-table-column label="出版时间" prop="publicationDate" :formatter="dateFormat"
                       show-overflow-tooltip></el-table-column>
      <el-table-column align="right" width="300px">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入书名关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" type="warning" v-if="scope.row.bookInventory == 0">
            没有库存
          </el-button>
          <el-button size="mini" v-if="scope.row.bookInventory != 0"
                     :type="bookId.indexOf(scope.row.bookId)==-1?'success':'info'"
                     :disabled="bookId.indexOf(scope.row.bookId)==-1?false:true"
                     @click="borrow(scope.row)">
            {{bookId.indexOf(scope.row.bookId)==-1?'借阅':'已借阅'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="position: absolute; left: 40%; top: 610px"
                   v-if="pagingSign"
                   background
                   layout="prev, pager, next"
                   :page-size="pageSize"
                   :current-page="parseInt(currentPage)"
                   :total="total" @current-change="page">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'BorrowBooks',
    inject: ['reload'],
    data () {
      return {
        //每页展示8条数据
        pageSize: 8,
        currentPage: 1,
        total: 0,
        search: '',
        userId: '',
        //搜索标记
        searchSign: true,
        //页面标记
        pageSign: false,
        //分页是否显示标记
        pagingSign: true,
        tableData: [],
        bookId: []
      }
    },
    created () {
      this.userId = sessionStorage.getItem('userId')
      let page = sessionStorage.getItem('currentPage')
      let search = sessionStorage.getItem('search')
      this.$axios.get('http://localhost:8089/Books/UserBook?userId=' + this.userId).then((resp) => {
        this.bookId = resp.data
      })
      if (page == 0) {
        this.pageSign = true
      } else {
        if (page > 0 && search != '') {
          this.searchSign = false
          this.search = search
        }
        sessionStorage.setItem('currentPage', page)
      }
      if (this.pageSign) {
        //初始化进入主页面
        this.page(1)
      } else if (this.searchSign) {
        // 没有搜索时修改页面
        this.page(page)
      } else {
        // 搜索时修改页面
        this.search = search
        this.searchSign = false
        this.page(page)
      }
    },
    methods: {
      //书籍分页查询
      page (pageNum) {
        sessionStorage.setItem('currentPage', pageNum)
        let page = sessionStorage.getItem('currentPage')
        let search = sessionStorage.getItem('search')
        this.reusePage(page, search)
      },
      // 复用分页查询
      reusePage (pageNum, search) {
        this.pagingSign = true
        if (search == '') {
          //未搜索时发送分页请求
          this.$axios.get('http://localhost:8089/Books/BorrowBooks?pageNum=' + pageNum + '&pageSize=' + this.pageSize + '&bookSign=' + true).then((resp) => {
            this.tableData = resp.data.list
            this.total = resp.data.total
            this.currentPage = resp.data.pageNum
            if (resp.data == '') {
              this.pagingSign = false
            }
          })
        } else {
          //搜索时发送分页请求
          this.$axios.get('http://localhost:8089/Books/BorrowBooks?pageNum=' + pageNum + '&pageSize=' + this.pageSize + '&bookSign=' + true + '&searchBook=' + search).then((resp) => {
            this.tableData = resp.data.list
            this.total = resp.data.total
            this.currentPage = pageNum
            this.searchSign = true
            if (resp.data == '') {
              this.pagingSign = false
            }
          })
        }
      },
      // 书籍借阅
      borrow (row) {
        this.$axios.put('http://localhost:8089/Books/Borrow', this.$qs.stringify({
          userId: this.userId,
          bookId: row.bookId
        })).then((resp) => {
          if (resp.data === 'success') {
            sessionStorage.setItem('pageRefresh', 1)
            this.reload()
            this.$message({type: 'success', message: '借阅成功!'})
          } else {
            this.$message({type: 'error', message: '借阅失败!'})
          }
        })
      },
      //格式化显示的时间
      dateFormat: function (row, column) {
        var date = row[column.property]
        if (date === undefined) {
          return ''
        }
        return this.$moment(date).format('YYYY-MM-DD')
      },
      // 弹出框
      handleClose (done) {
        done()
      }
    },
    watch: {
      search () {
        //搜索动态模糊查询
        let page = sessionStorage.getItem('currentPage')
        sessionStorage.setItem('search', this.search)
        if (this.searchSign) {
          this.page(1)
        } else {
          this.page(page)
        }
      }
    },
    destroyed () {
      let pageRefresh = sessionStorage.getItem('pageRefresh')
      if (pageRefresh == 1) {
        // 本页面修改 参数不做修改
      } else {
        // 退出本页面 初始化参数
        this.reload()
        sessionStorage.setItem('currentPage', 0)
        sessionStorage.setItem('search', '')
      }
      // 初始化判断离开页面的标记
      sessionStorage.setItem('pageRefresh', 0)
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
