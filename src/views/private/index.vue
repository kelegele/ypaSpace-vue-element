<template>
  <div>
    <div class="container">
      <sticky :z-index="10" class-name="sub-navbar">
        <el-input v-model="listQuery.name" placeholder="文件名" prefix-icon="el-icon-search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves style="margin-right: 20px;" class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
          查找文件
        </el-button>
        <el-button v-waves style="margin-right: 20px;" type="primary" icon="el-icon-upload" @click="handleUpload">
          上传
        </el-button>
        <el-button v-waves style="margin-right: 20px;" type="primary" icon="el-icon-download" @click="handleDownload">
          下载
        </el-button>
        <el-button v-waves style="margin-right: 20px;" type="success" icon="el-icon-folder-add" @click="handleNewFolder">
          新建文件夹
        </el-button>

      </sticky>
    </div>

    <div class="container dir">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          {{ name }}
        </el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in currentPaths" :key="item.index">
          <el-link :underline="false" @click="onClickPath(item)"> {{ item.path }}</el-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container main">
      <div class="grid">
        <div v-for="item in currentDir" :key="item.name">
          <div class="item" @click="onItemClick(item)">
            <i v-if="item.fileType === 'dir'" class="el-icon-folder" />
            <i v-else class="el-icon-document" />
            <span><el-link> {{ item.fileName }}</el-link></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'

export default {
  name: 'PrivateSpace',
  components: { Sticky },
  directives: { waves },
  data() {
    return {
      searchInput: '',
      currentPaths: [],
      currentDir: [],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      itemSelected: [],
      isCtrl: false,
      isShift: false
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.keyevent()
    this.getFiles('/')
  },

  methods: {
    handleSearch() { },
    handleUpload() {},
    handleDownload() {},
    handleNewFolder() { },
    keyevent() {
      var that = this
      document.onkeydown = function(e) { // 按下键盘
        switch (e.keyCode) {
          case 16:
            that.isShift = true
            break
          case 17:
            that.isCtrl = true
            break
        }
      }
      document.onkeyup = function(e) { // 放弃键盘
        switch (e.keyCode) {
          case 16:
            that.isShift = false
            break
          case 17:
            that.isCtrl = false
            break
        }
      }
    },
    onItemClick(item) {
      if (this.isCtrl) {
        console.log('ctrl', item)
      } else {
        console.log('no', item)
      }
    },
    onClickPath(item) {
    },
    getFiles(path) {
      console.log(path)
      this.$store.dispatch('files/getFiles', path).then((response) => {
        this.currentDir = response.currentDir
        this.currentPaths = response.currentPaths
        console.log('res', this)
      }).catch(() => {
      })
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
  padding: 20px;
  padding-top: 30px;
  text-align: center;
  font-size: 30px;
  color: #24292e;
  cursor: pointer;
}
.item:hover {
  background-color: rgb(235, 235, 235);
  }

span {
  display: block;
  font-size: 16px;
  margin-top: 10px;
}
</style>
