<template>
  <div style="height:650px;position: relative">
    <el-container style="border: 1px solid #eee">
      <el-header style="text-align: center; font-size: 16px">
        <i class="el-icon-s-home" style="margin-right: 15px"></i>
        <span>图书信息展示</span>
      </el-header>
    </el-container>
    <el-table :data="tableData" style="width: 100%;" border>
      <el-table-column label="图书编号" prop="bookId" show-overflow-tooltip></el-table-column>
      <el-table-column label="类别" prop="categoryName" show-overflow-tooltip></el-table-column>
      <el-table-column label="图书名称" prop="bookName" show-overflow-tooltip></el-table-column>
      <el-table-column label="图书作者" prop="bookAuthor" show-overflow-tooltip></el-table-column>
      <el-table-column label="总册数" prop="bookGross" show-overflow-tooltip></el-table-column>
      <el-table-column label="库存" prop="bookInventory" show-overflow-tooltip></el-table-column>
      <el-table-column label="出版社" prop="publishingHouse" show-overflow-tooltip></el-table-column>
      <el-table-column label="出版时间" prop="publicationDate" :formatter="dateFormat"
                       show-overflow-tooltip></el-table-column>
      <el-table-column align="right" width="300px">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入书名关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="bookUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="bookDelete(scope.row)">删除</el-button>
          <el-button size="mini" :type="scope.row.bookSign?'info':'success'" @click="bookSign(scope.row)">
            {{scope.row.bookSign?'下架':'上架'}}
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
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>你确定要删除<span style="color: red">《{{bookName}}》</span>吗</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="remove()">确 定</el-button>
      </span>
    </el-dialog>
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
        currentPage: 1,
        total: 0,
        search: '',
        //搜索标记
        searchSign: true,
        //页面标记
        pageSign: false,
        //分页是否显示标记
        pagingSign: true,
        //用于删除弹出框传参使用
        bookId: '',
        bookName: '',
        dialogVisible: false,
        tableData: []
      }
    },
    created () {
      let page = sessionStorage.getItem('currentPage')
      let search = sessionStorage.getItem('search')
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
      // 删除后退页方法
      retreatPage (pageNum, search) {
        if (search == '') {
          //没有搜索时删除为空退后一页
          this.$axios.get('http://localhost:8089/Books/BooksQuery?pageNum=' + (pageNum - 1) + '&pageSize=' + this.pageSize).then((resp) => {
            sessionStorage.setItem('currentPage', pageNum - 1)
            this.currentPage = (pageNum - 1)
            this.tableData = resp.data.list
            this.total = resp.data.total
            if (this.tableData == undefined) {
              this.pagingSign = false
            }
          })
        } else {
          //搜索时删除为空退后一页
          this.$axios.get('http://localhost:8089/Books/BooksQuery?pageNum=' + (pageNum - 1) + '&pageSize=' + this.pageSize + '&searchBook=' + search).then((resp) => {
            sessionStorage.setItem('currentPage', pageNum - 1)
            this.currentPage = (pageNum - 1)
            this.tableData = resp.data.list
            this.total = resp.data.total
            if (this.tableData == undefined) {
              this.pagingSign = false
            }
          })
        }
      },
      //书籍分页查询
      page (pageNum) {
        sessionStorage.setItem('currentPage', pageNum)
        let page = sessionStorage.getItem('currentPage')
        let search = sessionStorage.getItem('search')
        this.reusePage(page, search)
      },
      // 复用分页查询
      reusePage (pageNum, search) {
        let operate = sessionStorage.getItem('operate')
        this.pagingSign = true
        if (search == '') {
          //未搜索时发送分页请求
          this.$axios.get('http://localhost:8089/Books/BooksQuery?pageNum=' + pageNum + '&pageSize=' + this.pageSize).then((resp) => {
            this.tableData = resp.data.list
            this.total = resp.data.total
            this.currentPage = resp.data.pageNum
            if (resp.data == '') {
              if (operate == 'ok') {
                this.retreatPage(pageNum, search)
              } else {
                this.pagingSign = false
              }
            }
          })
        } else {
          //搜索时发送分页请求
          this.$axios.get('http://localhost:8089/Books/BooksQuery?pageNum=' + pageNum + '&pageSize=' + this.pageSize + '&searchBook=' + search).then((resp) => {
            this.tableData = resp.data.list
            this.total = resp.data.total
            this.currentPage = pageNum
            this.searchSign = true
            if (resp.data == '') {
              if (operate == 'ok') {
                this.retreatPage(pageNum, search)
              } else {
                this.pagingSign = false
              }
            }
          })
        }
      },
      //跳转到书籍修改页面
      bookUpdate (row) {
        sessionStorage.setItem('pageRefresh', 1)
        this.$router.push({path: '/Books/BooksEdit', query: {bookId: row.bookId}})
      },
      //书籍数据删除弹出框
      bookDelete (row) {
        this.dialogVisible = true
        this.bookName = row.bookName
        this.bookId = row.bookId
      },
      // 书籍上下架操作
      bookSign (row) {
        if (row.bookSign) {
          this.$axios.put('http://localhost:8089/Books/BooksEditSign', this.$qs.stringify({
            bookId: row.bookId,
            bookSign: false
          })).then((resp) => {
            if (resp.data === 'success') {
              sessionStorage.setItem('pageRefresh', 1)
              sessionStorage.setItem('operate', 'notRemove')
              this.reload()
              this.$message({type: 'warning', message: '下架成功!'})
            } else {
              this.$message({type: 'error', message: '下架失败!'})
            }
          })
        } else {
          this.$axios.put('http://localhost:8089/Books/BooksEditSign', this.$qs.stringify({
            bookId: row.bookId,
            bookSign: true
          })).then((resp) => {
            if (resp.data === 'success') {
              sessionStorage.setItem('pageRefresh', 1)
              sessionStorage.setItem('operate', 'notRemove')
              this.reload()
              this.$message({type: 'success', message: '上架成功!'})
            } else {
              this.$message({type: 'error', message: '上架失败!'})
            }
          })
        }
      },
      //书籍信息删除
      remove () {
        this.$axios.delete('http://localhost:8089/Books/BooksDelete/' + this.bookId).then((resp) => {
          this.dialogVisible = false
          if (resp.data === 'success') {
            sessionStorage.setItem('pageRefresh', 1)
            sessionStorage.setItem('operate', 'ok')
            this.reload()
            this.$message({type: 'success', message: '删除成功!'})
          } else {
            this.$message({type: 'error', message: '删除失败!'})
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
        sessionStorage.setItem('operate', 'no')
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
