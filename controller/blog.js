const { exec } = require('../db/mysql')
const xss = require('xss') //预防xss攻击 npm i xss -- save 把前台传过来的数据包起来 例： const title = xss(blogData.title)

const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`

  return exec(sql)

  //先返回假数据，格式是正确的
  // return [
  //     {
  //         id: 1,
  //         title: '标题A',
  //         content: '内容A',
  //         createTime: 1546610491112,
  //         author: 'zhangsan'
  //     },
  //     {
  //         id: 2,
  //         title: '标题B',
  //         content: '内容B',
  //         createTime: 1546610524373,
  //         author: 'lisi'
  //     }
  // ]
}

const getDetail = id => {
  const sql = `select * from blogs where id='${id}'`
  return exec(sql).then(rows => {
    return rows[0]
  })
  // return{
  //     id: 1,
  //     title: '标题A',
  //     content: '内容A',
  //     createTime: 1546610491112,
  //     author: 'zhangsan'
  // }
}

const newBlog = (blogData = {}) => {
  //blogData 是一个博客对象，包含title content author属性

  const title = xss(blogData.title)
  console.log('title is', title)
  const content = blogData.content
  const author = blogData.author
  const createTime = Date.now()

  const sql = `
        insert into blogs (title,content,author,createTime)
        values ('${title}','${content}','${author}',${createTime});
    `

  return exec(sql).then(insertData => {
    // console.log('insertData is ',insertData)
    return {
      id: insertData.insertId
    }
  })

  console.log('newBlog blogData...', blogData)
  return {
    id: 3
  }
}

const updateBlog = (blogData = {}) => {
  //id 是需要更新的博客id
  //blogData 是一个博客对象，包含title content 属性
  console.log('update blog', blogData)

  const title = blogData.title
  const content = blogData.content
  const id = blogData.id

  const sql = `
        update blogs set title='${title}',content='${content}' where id=${id}
    `
  return exec(sql).then(updateData => {
    console.log('updateData is', updateData)
    if (updateData.affectedRows > 0) {
      return true
    }
    return false
  })
}

const delBlog = (blogData = {}) => {
  const author = blogData.author
  const id = blogData.id

  const sql = `
        delete from blogs where id = ${id} and author='${author}'
    `
  return exec(sql).then(delData => {
    console.log('delData is', delData)
    if (delData.affectedRows > 0) {
      return true
    }
    return false
  })
  // return true
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}
