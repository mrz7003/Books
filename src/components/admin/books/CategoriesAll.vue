<template>
  <div style="height:650px; position: relative">
    <el-container style="border: 1px solid #eee">
      <el-header style="text-align: center; font-size: 16px">
        <i class="el-icon-s-home" style="margin-right: 15px"></i>
        <span>图书类别展示</span>
      </el-header>
    </el-container>
    <el-button style="float: right; width: 10%;margin-top: 10px;margin-bottom: 5px;" size="mini" type="success"
               @click="categoryInsert()">添加
    </el-button>
    <el-table :data="tableData" style="width: 100%;" border>
      <el-table-column label="类别编号" prop="categoryId" show-overflow-tooltip></el-table-column>
      <el-table-column label="类别名称" prop="categoryName" show-overflow-tooltip></el-table-column>
      <el-table-column align="right" width="300px">yy
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入类别名称关键字搜索"/>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="categoryUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="categoryDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" v-if="dialogInsertOrUpdate">
        <el-form-item label="类别编号" v-if="dialogUpdate">
          <el-input v-model="ruleForm.categoryId" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="类别名称" prop="categoryName">
          <el-input v-model="ruleForm.categoryName"></el-input>
        </el-form-item>
        <el-form-item align="center">
          <el-button type="success" @click="submitForm('ruleForm')">{{submitFormName}}</el-button>
          <el-button type="info" @click="resetForm('ruleForm')">重置</el-button>
          <el-button @click="closeDialog()">取 消</el-button>
        </el-form-item>
      </el-form>
      <template v-if="dialogDelete">
        <span>你确定要删除<span style="color: red">{{categoryName}}</span>吗</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog()">取 消</el-button>
          <el-button type="primary" @click="remove()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
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
    name: 'CategoryQuery',
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
        categoryId: '',
        categoryName: '',
        dialogTitle: '',
        submitFormName: '',
        dialogInsertOrUpdate: false,
        dialogDelete: false,
        dialogUpdate: false,
        dialogVisible: false,
        tableData: [],
        ruleForm: {
          categoryId: '',
          categoryName: '',
        },
        rules: {
          categoryName: [
            {required: true, message: '请输入图书类别名称', trigger: 'blur'},
            {min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur'}
          ],
        }
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
      retreatPage (pageNum, search) {
        if (search == '') {
          //没有搜索时删除为空退后一页
          this.$axios.get('http://localhost:8089/Category/CategoryQuery?pageNum=' + (pageNum - 1) + '&pageSize=' + this.pageSize).then((resp) => {
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
          this.$axios.get('http://localhost:8089/Category/CategoryQuery?pageNum=' + (pageNum - 1) + '&pageSize=' + this.pageSize + '&searchCategory=' + search).then((resp) => {
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
          this.$axios.get('http://localhost:8089/Category/CategoryQuery?pageNum=' + pageNum + '&pageSize=' + this.pageSize).then((resp) => {
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
          this.$axios.get('http://localhost:8089/Category/CategoryQuery?pageNum=' + pageNum + '&pageSize=' + this.pageSize + '&searchCategory=' + search).then((resp) => {
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
      //书籍类别数据添加弹出框
      categoryInsert () {
        this.dialogTitle = '类别信息添加'
        this.dialogInsertOrUpdate = true
        this.dialogVisible = true
        this.submitFormName = '立即创建'
      },
      //书籍类别数据删除弹出框
      categoryDelete (row) {
        this.categoryId = row.categoryId
        this.categoryName = row.categoryName
        this.dialogTitle = '类别信息删除'
        this.dialogDelete = true
        this.dialogVisible = true
      },
      //书籍类别数据修改弹出框
      categoryUpdate (row) {
        this.$axios.get('http://localhost:8089/Category/CategoryQueryOne?categoryId=' + row.categoryId).then((resp) => {
          this.ruleForm = resp.data
        })
        this.dialogTitle = '类别信息修改'
        this.dialogInsertOrUpdate = true
        this.dialogUpdate = true
        this.dialogVisible = true
        this.submitFormName = '立即修改'
      },
      //关闭弹出框
      closeDialog () {
        this.ruleForm.categoryName = ''
        this.dialogInsertOrUpdate = false
        this.dialogDelete = false
        this.dialogUpdate = false
        this.dialogVisible = false
      },
      // 弹出框
      handleClose (done) {
        this.ruleForm.categoryName = ''
        this.dialogInsertOrUpdate = false
        this.dialogDelete = false
        this.dialogUpdate = false
        this.dialogVisible = false
        done()
      },
      // 书籍类别数据添加修改
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.ruleForm.categoryId === '') {
              //数据添加
              this.$axios.post('http://localhost:8089/Category/CategoryInsert', this.$qs.stringify(this.ruleForm)).then((resp) => {
                this.dialogVisible = false
                this.dialogInsertOrUpdate = false
                switch (parseInt(resp.data)) {
                  case 1:
                    this.reload()
                    this.$message({type: 'success', message: '添加成功!'})
                    break
                  case 2:
                    this.$message({type: 'warning', message: '类别已存在,请重新添加,添加失败!'})
                    this.ruleForm.categoryName = ''
                    break
                  case 3:
                    this.$message({type: 'error', message: '添加失败!'})
                    break
                  default:
                    break
                }
              })
            } else {
              //数据修改
              this.$axios.put('http://localhost:8089/Category/CategoryUpdate', this.$qs.stringify(this.ruleForm)).then((resp) => {
                this.dialogVisible = false
                this.dialogInsertOrUpdate = false
                this.dialogUpdate = false
                if (resp.data === 'success') {
                  sessionStorage.setItem('pageRefresh', 1)
                  this.reload()
                  this.$message({type: 'success', message: '修改成功!'})
                } else {
                  this.$message({type: 'error', message: '修改失败!'})
                }
              })
            }
          } else {
            return false
          }
        })
      },
      //书籍类别信息删除
      remove () {
        this.$axios.delete('http://localhost:8089/Category/CategoryDelete/' + this.categoryId).then((resp) => {
          this.dialogVisible = false
          this.dialogDelete = false
          switch (parseInt(resp.data)) {
            case 1:
              sessionStorage.setItem('pageRefresh', 1)
              sessionStorage.setItem('operate', 'ok')
              this.reload()
              this.$message({type: 'success', message: '删除成功!'})
              break
            case 2:
              this.$message({type: 'warning', message: '类别下已有书籍不能删除,删除失败!'})
              break
            case 3:
              this.$message({type: 'error', message: '删除失败!'})
              break
            default:
              break
          }
        })
      },
      //重置添加 修改信息页面
      resetForm (formName) {
        this.ruleForm.categoryName = ''
        var updateId = this.ruleForm.categoryId
        this.$refs[formName].resetFields()
        this.ruleForm.categoryId = updateId
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
