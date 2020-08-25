const models = require('../db')
const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const $sql = require('../sqlMap')
const jwt = require('jsonwebtoken')
const async = require('async');
// 连接数据库
const conn = mysql.createConnection(models.mysql)
conn.connect()
let jsonWrite = function (res, ret) {
	if (typeof ret === 'undefined') {
		res.json({
			code: false,
			msg: '操作失败'
		})
	} else {
		ret = {
			data: ret,
			code: true,
			msg: '查询成功'
		}
		res.json(ret)
	}
}
// 拉取routes
router.get('/admin/routes/GetList', (req, res) => {
	let sqlGetList = $sql.routes.GetList,
		sqlSelectStatus = $sql.routes.auth.selectStatus
	conn.query(sqlGetList, function (err, result) {
		//console.log(result)
		if (err) {
			console.log(err, 'err');
		}
		if (result[0] === undefined) {
			res.json({
				code: false,
				list: [],
				msg: '操作成功'
			})
		} else {
			let dataString = JSON.parse(JSON.stringify(result)),
				data = ''
			console.log('************')
			let terraceCount = []
			async.map(dataString, function (item, callback) {
				let status = `${sqlSelectStatus} "${item.status}"`
				conn.query(status, function (errs, results) {
					item.children = JSON.parse(JSON.stringify(results))
					terraceCount.push(item)
					callback(null, terraceCount);
				})
			}, function (err, results) {
				jsonWrite(res, terraceCount)
			})
		}
	})
})

module.exports = router