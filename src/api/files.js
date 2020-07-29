import request from '@/utils/request'

export function getFiles(params) {
  return request({
    url: '/api/file/list',
    method: 'get',
    params
  })
}
