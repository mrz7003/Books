<template>
  <div>
    <el-container style="border: 1px solid #eee">
      <el-header style="text-align: center; font-size: 16px">
        <i class="el-icon-plus" style="margin-right: 15px"></i>
        <span>图书信息添加</span>
      </el-header>
    </el-container>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
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
      <el-form-item label="出版时间" required style="width: 50%; margin: 30px 25% 30px 25%;">
        <el-form-item prop="publicationDate">
          <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
                          v-model="ruleForm.publicationDate" style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item style="width: 50%; margin: 30px 15% 30px 35%;">
        <el-button type="success" @click="submitForm('ruleForm')">立即添加</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'BooksInsert',
    inject: ['reload'],
    data () {
      //自定义总册数只能输入数字
      let checkBookGross = (rule, value, callback) => {
        if (!Number.isInteger(value)) {
          return callback(new Error('请输入正确的数值'))
        } else {
          callback()
        }
      }
      return {
        option: [],
        ruleForm: {
          bookName: '',
          categoryId: '',
          bookAuthor: '',
          bookGross: '',
          publishingHouse: '',
          publicationDate: '',
          //添加图书信息默认为上架
          bookSign: true
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
    methods: {
      // 书籍数据添加
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('http://localhost:8089/Books/BooksInsert', this.$qs.stringify(this.ruleForm)).then((resp) => {
              if (resp.data === 'success') {
                this.$router.push('/Books/BooksAll')
                this.$message({type: 'success', message: '添加成功!'})
              } else {
                this.$message({type: 'error', message: '添加失败!'})
              }
            })
          } else {
            return false
          }
        })
      },
      //重置页面
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    },
    created () {
      //加载图书类别下拉列表
      this.$axios.get('http://localhost:8089/Category/CategoryQuery').then((resp) => {
        this.option = resp.data.list
      })
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
