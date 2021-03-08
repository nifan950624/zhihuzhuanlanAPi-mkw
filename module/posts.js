module.exports = (query, request, headers) => {
  return request(
    'post',
    `/posts`,
    query,
    { headers }
  )
}