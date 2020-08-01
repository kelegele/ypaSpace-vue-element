import request from '@/utils/request'

export function getFiles(params) {
  return request({
    url: '/api/file/list',
    method: 'get',
    params
  })
}

export function existFile(params) {
  return request({
    url: '/api/file/exist',
    method: 'get',
    params
  })
}

export function mkdirFile(params) {
  return request({
    url: '/api/file/mkdir',
    method: 'get',
    params
  })
}

export function deleteFile(params) {
  return request({
    url: '/api/file/delete',
    method: 'get',
    params
  })
}

export function downloadFile(params) {
  return request({
    url: '/api/file/download',
    method: 'get',
    headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }, // 定义相应头
    responseType: 'blob',
    params
  })
}
