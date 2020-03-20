<template>
  <div>
    <el-container style="border: 1px solid #eee">
      <el-header style="text-align: center; font-size: 16px">
          <i class="el-icon-user" style="margin-right: 15px"></i>
        <span>用户详细信息查看</span>
      </el-header>
    </el-container>
    <el-form :model="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户编号" style="width: 50%; margin: 30px 25% 30px 25%;">
        <el-input v-model="ruleForm.userId" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="用户名" style="width: 50%; margin: 30px 25% 30px 25%;">
        <el-input v-model="ruleForm.userName" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="用户密码" style="width: 50%; margin: 30px 25% 30px 25%;">
        <el-input v-model="ruleForm.userCode" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" style="width: 50%; margin: 30px 25% 30px 25%;">
        <el-input v-model="ruleForm.userPhone" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="状态" style="width: 50%; margin: 30px 25% 30px 25%;">
        <el-input disabled="disabled" value="正常" v-if="ruleForm.userSign"></el-input>
        <el-input disabled="disabled" value="封禁" v-if="!(ruleForm.userSign)"></el-input>
      </el-form-item>
      <el-form-item label="最近登录时间" style="width: 50%; margin: 30px 25% 30px 25%;">
        <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="ruleForm.userLoginTime" style="width: 100%;" disabled="disabled"></el-date-picker>
      </el-form-item>
      <el-form-item label="创建时间" style="width: 50%; margin: 30px 25% 30px 25%;">
        <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="ruleForm.createTime" style="width: 100%;" disabled="disabled"></el-date-picker>
      </el-form-item>
      <el-form-item style="width: 50%; margin: 30px 15% 30px 35%;">
        <el-button type="primary" @click="prevPage()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'UsersParticulars',
    data () {
      return {
        ruleForm: {
          userId: '',
          userName: '',
          userCode: '',
          userPhone: '',
          userAuthority: '',
          userSign: '',
          userLoginTime: '',
          createTime: ''
        }
      }
    },
    methods: {
      //返回上一个页面
      prevPage () {
        this.$router.go(-1)
      }
    },
    created () {
      // 查询查看用户的详细信息
      this.$axios.get('http://localhost:8089/Users/UsersQueryOne?userId=' + this.$route.query.userId).then((resp) => {
        this.ruleForm = resp.data
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
