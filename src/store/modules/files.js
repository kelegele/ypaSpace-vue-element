import { getFiles, existFile, mkdirFile, deleteFile } from '@/api/files'
import { getToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {

}

const actions = {
  getFiles({ state }, path) {
    return new Promise((resolve, reject) => {
      getFiles({ path: path.trim(), token: state.token }).then(response => {
        const { data } = response

        if (!data) {
          return reject('文件请求失败')
        }

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  existFile({ state }, path) {
    return new Promise((resolve, reject) => {
      existFile({ path: path.trim(), token: state.token }).then(response => {
        const { data } = response

        if (!data) {
          return reject('请求失败')
        }

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  mkdirFile({ state }, path) {
    return new Promise((resolve, reject) => {
      mkdirFile({ path: path.trim(), token: state.token }).then(response => {
        const { data } = response

        if (!data) {
          return reject('文件夹创建失败')
        }

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteFile({ state }, path) {
    return new Promise((resolve, reject) => {
      deleteFile({ path: path.trim(), token: state.token }).then(response => {
        const { data } = response

        if (!data) {
          return reject('文件删除失败')
        }

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

