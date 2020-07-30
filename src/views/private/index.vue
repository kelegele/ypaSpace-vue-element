<template>
  <div>
    <div class="container">
      <sticky :z-index="10" class-name="sub-navbar">
        <el-input v-model="listQuery.name" placeholder="文件名" prefix-icon="el-icon-search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves style="margin-right: 20px;" class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
          查找文件
        </el-button>

        <el-button v-waves style="margin-right: 20px;" icon="el-icon-upload" type="primary" @click="dialogVisible = true">上传</el-button>

        <el-dialog title="上传文件" :visible.sync="dialogVisible">

          <el-breadcrumb separator-class="el-icon-arrow-right" class="dialog-dir">
            <el-breadcrumb-item>
              {{ name }}
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in currentPaths" :key="item.index">
              <el-link :underline="false" @click="onClickPath(item)"> {{ item.path }}</el-link>
            </el-breadcrumb-item>
          </el-breadcrumb>

          <el-upload
            class="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :before-remove="beforeRemove"
            show-file-list="false"
            multiple
            :limit="5"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button v-waves style="margin-right: 20px;" type="primary" icon="el-icon-upload" @click="handleUpload">
              上传
            </el-button>
          </el-upload>
        </el-dialog>

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
          <el-link :underline="false" @click="onClickPath('/')"> {{ name }} </el-link>
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
            <span><el-link class="item-link"> {{ item.fileName }}</el-link></span>
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
      dialogVisible: false,
      searchInput: '',
      currentPaths: [],
      currentDir: [],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      itemSelected: [],
      fileList: [],
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
    handleNewFolder() {
      this.$prompt('请输入文件夹名称', '新建文件夹', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '新建文件夹: ' + value
        })

        console.log(value, this.currentPaths)
        let path = '/'
        this.currentPaths.forEach(element => {
          path = path + '/' + element.path
        })
        path = path + '/' + value
        console.log('NewFolder', path)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
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
        // TODO
        console.log('ctrl', item)
      } else {
        console.log('no ctrl', item)
      }

      if (item.fileType === 'dir') {
        console.log('path', item.filePath)
        this.getFiles(item.filePath)
      }
    },
    onClickPath(path) {
      // console.log(path)
      let uPath = '/'

      if (path === '/') {
        return this.getFiles(uPath)
      }

      for (let i = 0; i < this.currentPaths.length; i++) {
        uPath = uPath + '/' + this.currentPaths[i].path
        // console.log(uPath)
        if (path.index === this.currentPaths[i].index) {
          // console.log(uPath)
          break
        }
      }
      this.getFiles(uPath)
    },
    getFiles(path) {
      console.log(path)
      this.$store.dispatch('files/getFiles', path).then((response) => {
        this.currentDir = response.currentDir
        this.currentPaths = response.currentPaths
        console.log('res', this)
      }).catch(() => {
      })
    },

    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
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

.upload {
  display: inline-block;
}

.dir {
  padding-left: 10px;
  position: relative;
}

.dialog-dir {
  margin-bottom: 20px;
}

.grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}

.item-link{
  word-wrap: break-word;
  word-break: normal;
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
