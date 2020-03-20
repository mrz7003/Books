<template>
  <div>
    <el-container style="border: 1px solid #eee">
      <el-header style="text-align: center; font-size: 16px">
        <i class="el-icon-refresh" style="margin-right: 15px"></i>
        <span>图书信息修改</span>
      </el-header>
    </el-container>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="图书编号" prop="bookId" style="width: 50%; margin: 30px 25% 30px 25%;">
        <el-input v-model="ruleForm.bookId" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="图书名称" prop="bookName" style="width: 50%; margin: 30px 25% 30px 25%;">
        <el-input v-model="ruleForm.bookName"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="categoryId" style="width: 50%; margin: 30px 25% 30px 25%;">
        <el-select v-model="ruleForm.categoryId" placeholder="请选择图书类别" style="width: 100%;">
          <el-option v-for="(item,index) in option" :key="index" :value="item.categoryId"
                     :label="item.categoryName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图书作者" prop="bookAuthor" style="width: 50%; margin: 30px 25% 30px 25%;">
        <el-input v-model="ruleForm.bookAuthor"></el-input>
      </el-form-item>
      <el-form-item label="总册数" prop="bookGross" style="width: 50%; margin: 30px 25% 30px 25%;">
        <el-input v-model.number="ruleForm.bookGross"></el-input>
      </el-form-item>
      <el-form-item label="出版社" prop="publishingHouse" style="width: 50%; margin: 30px 25% 30px 25%;">
        <el-input v-model="ruleForm.publishingHouse"></el-input>
      </el-form-item>
      <el-form-item label="出版时间" prop="publicationDate" required style="width: 50%; margin: 30px 25% 30px 25%;">
        <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
                        v-model="ruleForm.publicationDate" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item style="width: 50%; margin: 30px 15% 30px 35%;">
        <el-button type="primary" @click="submitForm('ruleForm')">立即修改</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="info" @click="returnLast()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'BooksUpdate',
    data () {
      //自定义总册数只能输入数字
      var checkBookGross = (rule, value, callback) => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入正确的数值'))
        } else {
          if (parseInt(this.ruleForm.bookGross) < this.ruleForm.num) {
            callback(new Error('修改的总册数不能小于原本的总册数'))
          }
          callback()
        }
      }
      return {
        option: [],
        ruleForm: {
          bookId: '',
          bookName: '',
          categoryId: '',
          bookAuthor: '',
          bookGross: '',
          publishingHouse: '',
          publicationDate: '',
          bookSign: '',
          //添加变量接收原总册数
          num: 0,
        },
        rules: {
          bookName: [
            {required: true, message: '请输入图书名称', trigger: 'blur'},
            {min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur'}
          ],
          categoryId: [
            {required: true, message: '请选择图书类别', trigger: 'blur'},
          ],
          bookAuthor: [
            {required: true, message: '请输入作者姓名', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
          ],
          bookGross: [
            {required: true, message: '请输入图书数量', trigger: 'blur'},
            {validator: checkBookGross, trigger: 'blur'}
          ],
          publishingHouse: [
            {required: true, message: '请输入出版社名称', trigger: 'blur'},
            {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
          ],
          publicationDate: [
            {required: true, message: '请选择出版日期', trigger: 'change'}
          ],
        }
      }
    },
    created () {
      // 查询需要修改的图书信息
      this.$axios.get('http://localhost:8089/Books/BooksQueryOne?bookId=' + this.$route.query.bookId).then((resp) => {
        this.ruleForm = resp.data
        // 接收原本的总册数
        this.ruleForm.num = resp.data.bookGross
      })
      // 加载图书类别下拉列表
      this.$axios.get('http://localhost:8089/Category/CategoryQuery').then((resp) => {
        this.option = resp.data.list
      })
    },
    methods: {
      // 书籍数据修改
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.put('http://localhost:8089/Books/BooksUpdate', this.$qs.stringify(this.ruleForm, {num: this.num})).then((resp) => {
              if (resp.data === 'success') {
                this.$router.push('/Books/BooksAll')
                this.$message({type: 'success', message: '修改成功!'})
              } else {
                this.$message({type: 'error', message: '修改失败!'})
              }
            })
          } else {
            return false
          }
        })
      },
      resetForm (formName) {
        var updateId = this.ruleForm.bookId
        this.$refs[formName].resetFields()
        this.ruleForm.bookId = updateId
      },
      returnLast () {
        this.$router.go(-1)
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
