<template>
  <div style="width: 100%">
    <el-container style="border: 1px solid #eee">
      <el-header style="text-align: center; font-size: 16px">
        <i class="el-icon-view" style="margin-right: 15px"></i>
        <span>图书信息图表展示</span>
      </el-header>
    </el-container>
    <div class="circular">
      <p class="text">书籍分类(总册数)</p>
      <ve-ring :data="circularData" :settings="circularSettings"></ve-ring>
    </div>
    <div class="columnar">
      <p class="text">书籍分类(总册数 or 库存)</p>
      <ve-histogram :data="columnarData" width="1000px" :settings="columnarSettings" ></ve-histogram>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BooksCharts',
    data () {
      this.circularSettings = {
        radius: [10, 100],
      }
      this.columnarSettings = {
        legendName:{
          'category': '图书类别',
          'gross': '总册数',
          'inventory': '库存'
        },
        labelMap:{
          'category': '图书类别',
          'gross': '总册数',
          'inventory': '库存'
        },
        yAxisName: ["册数"]
      }
      return {
        circularData: {
          columns: ['category', 'gross'],
          rows: []
        },
        columnarData: {
          columns: ['category', 'gross', 'inventory'],
          rows: []
        }
      }
    },
    created () {
      this.$axios.get('http://localhost:8089/Charts/BooksCharts/ClassifyGross').then((resp) => {
        this.circularData.rows = resp.data
      })
      this.$axios.get('http://localhost:8089/Charts/BooksCharts/ClassifyGrossAndBorrow').then((resp) => {
        this.columnarData.rows = resp.data
      })
    }
  }
</script>

<style scoped>
  .circular {
    float: left;
    width: 35%;
    margin-top: 100px;
  }

  .columnar {
    float: right;
    width: 65%;
    margin-top: 100px;
  }

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
