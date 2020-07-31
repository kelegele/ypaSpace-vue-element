<template>
  <div>
    <div class="container">
      <div class="sub-navbar">
        <el-input v-model="listQuery.name" placeholder="文件名" prefix-icon="el-icon-search" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves style="margin-right: 20px;" class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
          查找文件
        </el-button>

        <el-button v-waves style="margin-right: 20px;" icon="el-icon-upload" type="primary" @click="beforeUpload(token)">上传</el-button>

        <el-dialog title="上传文件到..." :visible.sync="dialogUploadVisible">

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
            :action="uploadUrl"
            :data="uploadData"
            multiple
            :on-success="uploadSuccess"
            :on-error="uploadErr"
            :limit="5"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-button v-waves style="margin-right: 20px;" type="primary" icon="el-icon-upload">
              上传
            </el-button>
            <div slot="tip" class="el-upload__tip">同名文件将会被覆盖，文件且不超过1000kb</div>
          </el-upload>
        </el-dialog>

        <el-button v-waves style="margin-right: 20px;" type="primary" icon="el-icon-download" @click="dialogDownloadVisible = true">
          下载
        </el-button>
        <el-dialog title="删除文件" :visible.sync="dialogDownloadVisible">
          <el-table ref="downloadSelected" :data="currentDir" @selection-change="handleDownloadSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column property="fileName" label="文件名" />
            <el-table-column property="filePath" label="文件目录" />
          </el-table>
          <el-button v-waves style="margin-top: 30px;" type="primary" icon="el-icon-download" @click="handleDownload(downloadSelected)">下载</el-button>
        </el-dialog>

        <el-button v-waves style="margin-right: 20px;" type="success" icon="el-icon-folder-add" @click="handleNewFolder">
          新建文件夹
        </el-button>

        <el-button v-waves style="margin-right: 20px;" type="danger" icon="el-icon-delete" @click="dialogDeleteVisible = true">
          删除文件
        </el-button>

        <el-dialog title="删除文件" :visible.sync="dialogDeleteVisible">
          <el-table ref="delSelected" :data="currentDir" @selection-change="handleDelSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column property="fileName" label="文件名" />
            <el-table-column property="filePath" label="文件目录" />
          </el-table>
          <el-button v-waves style="margin-top: 30px;" type="danger" icon="el-icon-delete" @click="handleDelete(delSelected)">确认删除</el-button>
        </el-dialog>

      </div>
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
import waves from '@/directive/waves'
import { mapGetters } from 'vuex'

export default {
  name: 'PrivateSpace',
  directives: { waves },
  data() {
    return {
      dialogUploadVisible: false,
      dialogDeleteVisible: false,
      dialogDownloadVisible: false,
      searchInput: '',
      delSelected: [],
      downloadSelected: [],
      currentPaths: [],
      currentDir: [],
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined
      },
      itemSelected: [],
      fileList: [],
      uploadUrl: '/api/file/upload',
      uploadData: { 'token': '55555', 'path': 'token' },
      isCtrl: false,
      isShift: false
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'token'
    ])
  },
  created() {
    this.keyevent()
    console.log('private created')
    this.getFiles('/')
  },

  methods: {
    handleSearch() { },
    handleDownload() {
      console.log('download list', this.downloadSelected)
    },
    handleDownloadSelectionChange(value) {
      console.log('Download change', value)
      this.downloadSelected = value
    },
    handleNewFolder() {
      this.$prompt('请输入文件夹名称', '新建文件夹', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        console.log(value, this.currentPaths)
        const path = this.getCurrentPath() + '/' + value
        console.log('NewFolder', path)

        this.existFile(path)
        this.mkdirFile(path)
        this.$message({
          type: 'info',
          message: '新建文件夹：' + value
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    handleDelSelectionChange(value) {
      console.log('Del change', value)
      this.delSelected = value
    },
    handleDelete(fileList) {
      console.log('handleDelete', fileList)
      for (let i = 0; i < fileList.length; i++) {
        this.deleteFile(fileList[i].filePath)
      }
      const uPath = this.getCurrentPath()

      this.getFiles(uPath)
    },
    getCurrentPath() {
      let uPath = '/'
      this.currentPaths.forEach(element => {
        uPath = uPath + '/' + element.path
      })
      return uPath
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
      console.log('getFiles', path)
      this.$store.dispatch('files/getFiles', path).then((response) => {
        this.currentDir = response.currentDir
        this.currentPaths = response.currentPaths
        console.log('getFiles res', response)
      }).catch(() => {
      })
    },
    mkdirFile(path) {
      console.log('mkdirFile', path)
      this.$store.dispatch('files/mkdirFile', path).then((response) => {
        console.log('mkdirFile res', response)

        const uPath = this.getCurrentPath()
        this.getFiles(uPath)
      }).catch(() => {
      })
    },
    existFile(path) {
      console.log('existFile', path)
      this.$store.dispatch('files/existFile', path).then((response) => {
        console.log('existFile res', response)
        if (response) {
          this.$message({
            type: 'info',
            message: '已存在文件夹: ' + path
          })
        } else {
          this.$message({
            type: 'info',
            message: '不存在文件夹: ' + path
          })
        }
      }).catch(() => {
      })
      return false
    },
    deleteFile(path) {
      console.log('deleteFile', path)
      this.$store.dispatch('files/deleteFile', path).then((response) => {
        console.log('deleteFile res', response)
        if (response) {
          this.$message({
            type: 'info',
            message: '已删除: ' + path
          })
        } else {
          this.$message({
            type: 'info',
            message: '删除失败: ' + path
          })
        }
        this.getFiles()
      }).catch(() => {
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(`超出限制：本次选择了 ${files.length} 个文件，每次限制5个文件！`)
    },
    uploadSuccess(response, file, fileList) {
      console.log('uploadSuccess', file)
      this.$message.success(response.message + file.name)
      this.getFiles(this.getCurrentPath())
      this.fileList = []
    },
    uploadErr(err, file, fileList) {
      this.$message.error(err)
    },
    beforeUpload(token) {
      this.dialogUploadVisible = true
      this.fileList = []
      const uPath = this.getCurrentPath()
      this.uploadData = { token: token, path: uPath }
      console.log('beforeUpload', this.uploadData)
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
  grid-template-rows: repeat(auto-fill, minmax(50px, 1fr));
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
  position: relative;
  width: 125px;
  height: 125px;
  overflow: hidden;
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
