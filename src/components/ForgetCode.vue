<template>
  <div>
    <el-container style="border: 1px solid #eee">
      <el-header style="text-align: center; font-size: 16px">
        <i class="el-icon-s-promotion" style="margin-right: 15px"></i>
        <span>找回密码</span>
      </el-header>
    </el-container>
    <el-steps :active="active" finish-status="success" align-center
              style="width: 50%; margin: 30px 30% 30px 25%;">
      <el-step title="用户信息" icon="el-icon-edit"></el-step>
      <el-step title="手机验证" icon="el-icon-upload"></el-step>
      <el-step title="完成" icon="el-icon-check"></el-step>
    </el-steps>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名称" prop="userName" style="width: 50%; margin: 30px 25% 30px 25%;" v-if="active==0">
        <el-input v-model="ruleForm.userName"></el-input>
      </el-form-item>
      <div v-if="active==1">
        <el-form-item label="手机号码" prop="userPhone" style="width: 50%; margin: 30px 25% 30px 25%;">
          <el-input v-model.number="ruleForm.userPhone" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verificationCode" style="width: 50%; margin: 30px 25% 30px 25%;">
          <el-input v-model="ruleForm.verificationCode" maxlength="6" style="width: 50%;margin-right: 20%"></el-input>
          <el-button type="success" style="position: absolute;right: 1%;width: 30%" @click="sendCode()"
                     :disabled="sendCodeBtnSign">
            {{sendCodeBtn}}
          </el-button>
        </el-form-item>
      </div>
      <div v-if="active==2">
        <el-form-item label="密码" prop="userCode" style="width: 50%; margin: 30px 25% 30px 25%;">
          <el-input v-model="ruleForm.userCode" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmCode" style="width: 50%; margin: 30px 25% 30px 25%;">
          <el-input v-model="ruleForm.confirmCode" type="password"></el-input>
        </el-form-item>
      </div>
      <el-form-item style="width: 50%; margin: 30px 25% 30px 35%;">
        <el-button type="primary" @click="submitForm('ruleForm')">{{submitFormBtn}}</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button type="info" @click="returnLast()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'Register',
    data () {
      //验证两次密码是否一致
      const checkCode = (rule, value, callback) => {
        if (value != this.ruleForm.userCode) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }
      const checkPhone = (rule, value, callback) => {
        if (!(/^1[34578]\d{9}$/.test(value))) {
          callback(new Error('请输入正确的电话号码'))
        } else {
          callback()
        }
      }
      const checkVerificationCode = (rule, value, callback) => {
        if (!Number.isInteger(value) && value.length != 6) {
          callback(new Error('请输入正确的验证码'))
        } else {
          callback()
        }
      }
      return {
        sendCodeBtnSign: false,
        sendCodeBtn: '获取验证码',
        submitFormBtn: '下一步',
        active: 0,
        // 用来接收检查通过用户的信息
        userId: '',
        userName: '',
        userPhone: '',
        ruleForm: {
          userName: '',
          userCode: '',
          confirmCode: '',
          userPhone: '',
          verificationCode: '',
        },
        rules: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 1, max: 25, message: '长度在 3 到 25 个字符', trigger: 'blur'}
          ],
          userCode: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
          ],
          confirmCode: [
            {required: true, message: '请输入确认密码', trigger: 'blur'},
            {validator: checkCode, trigger: 'blur'}
          ],
          userPhone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: checkPhone, trigger: 'blur'}
          ],
          verificationCode: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {validator: checkVerificationCode, trigger: 'blur'},
          ],
        }
      }
    },
    methods: {
      // 忘记密码
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            switch (this.active) {
              case 0:
                this.$axios.get('http://localhost:8089/Users/CheckName?userName=' + this.ruleForm.userName).then((resp) => {
                  if (resp.data != '') {
                    this.$message({type: 'success', message: '验证成功'})
                    this.userId = resp.data.userId
                    this.userName = resp.data.userName
                    this.userPhone = resp.data.userPhone
                    this.active++
                  } else {
                    this.$message({type: 'error', message: '验证失败,用户不存在'})
                  }
                })
                break
              case 1:
                this.$axios.get('http://localhost:8089/Users/CheckVerificationCode?userPhone=' + this.ruleForm.userPhone + '&verificationCode=' + this.ruleForm.verificationCode).then((resp) => {
                  switch (parseInt(resp.data)) {
                    case 1:
                      this.$message({type: 'success', message: '验证成功'})
                      this.submitFormBtn = '修改'
                      this.active++
                      break
                    case 2:
                      this.$message({type: 'error', message: '验证码不正确'})
                      break
                    case 3:
                      this.$message({type: 'info', message: '验证码已过期'})
                      break
                  }
                })
                break
              case 2:
                this.$axios.put('http://localhost:8089/Users/ChangeCode', this.$qs.stringify({
                  userId: this.userId,
                  userCode: this.ruleForm.userCode
                })).then((resp) => {
                  if (resp.data === 'success') {
                    this.$message({type: 'success', message: '修改成功'})
                    window.location.reload()
                  } else {
                    this.$message({type: 'warning', message: '修改失败,请重新验证'})
                    this.$router.push('/ForgetCode')
                  }
                })
                break
              default:
                break
            }
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      returnLast () {
        this.$router.go(-1)
      },
      //发送短信 获取验证码
      sendCode () {
        if (!(/^1[34578]\d{9}$/.test(this.ruleForm.userPhone))) {
          this.$message({type: 'warning', message: '请输入正确的手机号!'})
          return
        } else if (this.ruleForm.userPhone != this.userPhone) {
          this.$message({type: 'warning', message: '输入的手机号有误!'})
          return
        }
        this.$axios.post('http://localhost:8089/Users/SendCode', this.$qs.stringify({userPhone: this.ruleForm.userPhone})).then((resp) => {
          if (resp.data === 'success') {
            this.$message({type: 'success', message: '发送成功,验证码有效期五分钟'})
            this.sendCodeBtn = 60
            this.sendCodeBtnSign = true
            let timer = setInterval(() => {
              this.sendCodeBtn = parseInt(this.sendCodeBtn) - 1
              if (this.sendCodeBtn === 0) {
                clearInterval(timer)
                this.sendCodeBtn = '重新发送'
                this.sendCodeBtnSign = false
              }
            }, 1000)
          } else {
            this.$message({type: 'warning', message: '发送失败,请重新发送'})
            this.sendCodeBtn = '重新发送'
          }
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
