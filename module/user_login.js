module.exports = (query, request) => {
  return request(
    'POST',
    `/user/login`,
    query
  )
}