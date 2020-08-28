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
	console.log(req.query.grade)
	let sqlGetList = $sql.routes.GetList,
		sqlselectGrade = $sql.routes.auth.selectGrade,
		sqlSelectStatusChild = $sql.routes.auth.selectStatusChild,
		reqGrade = req.query.grade,
		authRoundGrade = sqlGetList;
	if (reqGrade != 0 && reqGrade != undefined) {
		authRoundGrade = `${sqlGetList}${sqlselectGrade}"${reqGrade}"`
	}
	conn.query(authRoundGrade, function (err, result) {
		console.log(result)
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
			let terraceCount = []
			async.map(dataString, function (item, callback) {
				let status = `${sqlSelectStatusChild} "${item.status}"`
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