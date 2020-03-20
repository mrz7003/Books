<template>
  <div>
    <el-container style="border: 1px solid #eee">
      <el-header style="text-align: center; font-size: 16px">
        <i class="el-icon-view" style="margin-right: 15px"></i>
        <span>用户访问信息图表展示</span>
      </el-header>
    </el-container>
    <div style="margin-top: 100px;">
      <p class="text">近一周用户访问量和借阅量</p>
      <ve-line :data="brokenLineData" :settings="brokenLineSettings"></ve-line>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'UsersCharts',
    data () {
      this.brokenLineSettings = {
        legendName: {
          'visitDate': '日期',
          'visitPeople': '访问人数',
          'visitBorrow': '借阅数'
        },
        labelMap: {
          'visitDate': '日期',
          'visitPeople': '访问人数',
          'visitBorrow': '借阅数'
        },
      }
      return {
        brokenLineData: {
          columns: ['visitDate', 'visitPeople', 'visitBorrow'],
          rows: []
        }
      }
    },
    created () {
      this.$axios.get('http://localhost:8089/Charts/UsersCharts/UserVisit').then((resp) => {
        this.brokenLineData.rows = resp.data
      })
    }
  }
</script>

<style scoped>

  .text {
    font-size: 20px;
    color: red;
    text-align: center;
  }

  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>
