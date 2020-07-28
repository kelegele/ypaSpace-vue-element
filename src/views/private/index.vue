<template>
  <div>
    <div class="container">
      <sticky :z-index="10" class-name="sub-navbar">
        <el-button style="margin-right: 20px;" type="primary">
          上传
        </el-button>
        <el-button style="margin-right: 20px;" type="primary">
          下载
        </el-button>
        <el-button style="margin-right: 20px;" type="success">
          新建文件夹
        </el-button>

        <el-input
          v-model="searchInput"
          class="searchInput"
          type="text"
          autosize
          placeholder="搜索文件"
          prefix-icon="el-icon-search"
        />
      </sticky>
    </div>

    <div class="container dir">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>username</el-breadcrumb-item>
        <el-breadcrumb-item>files</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container main">
      <div class="grid">
        <div v-for="item in currentDir" :key="item.name">
          <div class="item">
            <i v-if="item.type === 'dir'" class="el-icon-folder" />
            <i v-else class="el-icon-document" />
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'

export default {
  name: 'PrivateSpace',
  components: { Sticky },
  data() {
    return {
      searchInput: '',
      currentDir: [
        { type: 'flie', name: '文件' },
        { type: 'dir', name: '文件夹1' },
        { type: 'dir', name: '文件夹2' }
      ]
    }
  }
}
</script>

<style scoped>
.container {
  margin: 20px;
}

.main {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}

.searchInput {
  display: inline-block;
  width: 200px;
  right: 0;
}

.dir {
  padding-left: 10px;
  position: relative;
}

.grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}

.item {
  margin: 20px;
  height: 85px;
  text-align: center;
  width: 100px;
  float: left;
  font-size: 30px;
  color: #24292e;
  cursor: pointer;
}

span {
  display: block;
  font-size: 16px;
  margin-top: 10px;
}
</style>
