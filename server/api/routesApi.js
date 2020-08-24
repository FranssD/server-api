const models = require('../db')
const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const $sql = require('../sqlMap')
const jwt = require('jsonwebtoken')
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
			console.log(dataString)
			console.log('************')

			function childrenFor(dataString) {
				return dataString.forEach(function (data) {
					console.log(data, 1)
					status = `${sqlSelectStatus} "${data.status}"`
					conn.query(status, function (errs, results) {
						console.log(results)
					})
				})
			}
			async function childrenObj(dataString) {
				const v = await childrenFor(dataString)
				console.log(v,2)
			}
			childrenObj(dataString)
			// for (let i in dataString) {
			// 	let status = `${sqlSelectStatus} "${dataString[i].status}"`
			// 	conn.query(status, function (errs, results) {
			// 		if (errs) {
			// 			console.log(errs, 'err');
			// 		}
			// 		let dataStringChildren = JSON.parse(JSON.stringify(results));
			// 		dataString[i].children = dataStringChildren
			// 		//dataString.children[i]=1
			// 		//console.log(dataString)
			// 		data = dataString
			// 		console.log(data, '3')
			// 	})
			// 	console.log(data, '2')
			// };
			//console.log(data, '1')
			//jsonWrite(res, dataString)
			//
		}
	})
})

module.exports = router