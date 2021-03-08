module.exports = (query, request) => {
  return request(
    'get',
    `/columns`,
    query
  )
}