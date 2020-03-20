<template>
  <div class="body_bg">
    <template class="outer_label">
      <img class="inner_label" src="../assets/bookLogo.png">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="login_form">
        <el-form-item prop="userName">
          <el-input v-model="ruleForm.userName" class="qxs-ic_user qxs-icon el_input_color"
                    placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="userCode">
          <el-input type="password" v-model="ruleForm.userCode" class="qxs-ic_password qxs-icon el_input_color"
                    placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 20px;margin-bottom: 0px">
          <span>记住密码</span>
          <el-checkbox v-model="ruleForm.checked"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="login_btn" @click="submitForm('ruleForm')" type="primary" round>
            <span style="text-align: center">登录</span>
          </el-button>
        </el-form-item>
        <template style="margin-top: 10px">
          <span style="float: left;color: blue"><el-button class="btn" @click="toRegister()">用户注册</el-button></span>
          <span style="float: right;color: blue"><el-button class="btn" @click="toForgetCode()">忘记密码？</el-button></span>
        </template>
      </el-form>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data () {
      return {
        ruleForm: {
          userName: '',
          userCode: '',
          checked: false
        },
        rules: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur'}
          ],
          userCode: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('http://localhost:8089/Users/UsersLogin', this.$qs.stringify(this.ruleForm)).then((resp) => {
              switch (parseInt(resp.data)) {
                case 1:
                  this.$router.push('/Index')
                  break
                case 2:
                  this.$message({type: 'error', message: '用户名不存在!'})
                  break
                case 3:
                  this.$message({type: 'error', message: '密码错误!'})
                  break
                case 4:
                  this.$message({type: 'warning', message: '该账号已被禁用 请联系管理员解封!'})
                  break
                default:
                  break
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
      },
      //跳转用户注册页面
      toRegister () {
        this.$router.push('/Register')
      },
      //跳转忘记密码页面
      toForgetCode () {
        this.$router.push('/ForgetCode')
      }
    }
  }
</script>

<style scoped>
  .body_bg {
    width: 100%;
    height: 100%;
    background-image: url("../assets/backgroundImg.png");
    position: fixed;
    background-size: 100% 100%;
  }

  .el_input_color >>> .el-input__inner {
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
  }

  .login_form {
    padding-left: 35%;
    padding-right: 35%;
    width: 30%;
  }

  .qxs-ic_user {
    background: url("../assets/userLogo.png") no-repeat;
    background-size: 6%;
    background-position: 2%;
  }

  .qxs-ic_password {
    background: url("../assets/codeLogo.png") no-repeat;
    background-size: 6%;
    background-position: 2%;
  }

  .login_btn {
    width: 50%;
    margin-top: 20px;
    margin-left: 25%;
    /*margin-right: 25%;*/
    font-size: 16px;
  }

  .inner_label {
    padding-top: 5%;
    padding-left: 30%;
    padding-right: 30%;
    width: 40%;
  }

  .qxs-icon {
    margin-top: 20px;
    height: 40px;
    width: 90%;
    margin-bottom: 5px;
    padding-left: 10%;
    border: none;
    border-bottom: solid 1px black;
  }

  .btn {
    color: blue;
    font-size: 20px;
    background-color: transparent;
    border: 0px solid transparent;
    outline: none;
  }
</style>
