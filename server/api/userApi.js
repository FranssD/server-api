// node 不能直接使用es6  import xxx from 'xxx'
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
// 拉取所有用户
router.get('/admin/auth/GetList', (req, res) => {
	let sqlGetList = $sql.user.GetList
	conn.query(sqlGetList, function (err, result) {
		if (err) {

		}
		if (result[0] === undefined) {
			res.json({
				code: false,
				list: [],
				msg: '操作成功'
			})
		} else {
			jsonWrite(res, result)
		}
	})
})

// 登录
router.post('/admin/auth/login', (req, res) => {
	let sqlSelectName = $sql.user.auth.selectName
	let sqlSelectPwd = $sql.user.auth.selectAndPwd
	let RowData = req.body.params
	let authName = `${sqlSelectName}"${RowData.username}"`
	let auth = `${sqlSelectName}"${RowData.username}"${sqlSelectPwd}"${RowData.pwd}"`
	if ((RowData.username == '') || (RowData.pwd == '')) {
		res.json({
			code: false,
			msg: '账号或者密码不能为空'
		})
	} else {
		conn.query(authName, function (err, result) {
			if (err) {
				console.log(err, 'err');
			}
			if (result[0] == undefined) {
				res.json({
					code: false,
					msg: '账号不存在'
				})
			} else {
				conn.query(auth, function (errs, results) {
					if (errs) {
						console.log(errs, 'err');
					}
					console.log(results[0])
					if (results[0] == undefined) {
						res.json({
							code: false,
							msg: '密码输入错误'
						})
					} else {
						//jwt.sign(payload,secret);
						let userInfo = {
							id: results[0].id,
							nickname: results[0].nickname,
							grade:results[0].grade,
							token:''
						}
						let secret = 'mi_yao';
						userInfo.token =jwt.sign(userInfo,secret)
						res.json({
							data:{
								userInfo,
							},
							code: true,
							msg: '登录成功'
						})
					}
				})
			}
		})
	}
})
// 增加用户接口
router.post('/admin/auth/addUser', (req, res) => {
	let sqlAdd = $sql.user.add
	let RowData = req.body.params
	let sqlSelectName = $sql.user.auth.selectName
	let auth = `${sqlSelectName}"${RowData.username}"`
	if ((RowData.username == '') || (RowData.pwd == '')) {
		res.json({
			code: false,
			msg: '账号或者密码不能为空'
		})
	} else {
		conn.query(auth, function (err, result) {
			if (err) {
				console.log(err, 'err');
			}
			if (result[0] !== undefined) {
				res.json({
					code: false,
					msg: '账号已被注册'
				})
			} else {
				conn.query(sqlAdd, [RowData.username, RowData.pwd], function (errs, results) {
					if (errs) {
						console.log(errs, 'err');
					}
					if (results[0] === undefined) {
						res = {
							code: true,
							msg: '注册成功'
						}
						jsonWrite(res, results)
					}
				})
			}
		})
	}
});

module.exports = router
