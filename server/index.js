const userApi = require('./api/userApi')
const routesApi = require('./api/routesApi')

const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const cors = require('cors')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: false
}))

// 后端api路由----auth
//userApi,routesApi
app.use(userApi,routesApi, cors({
	origin: ['http://127.0.0.1:5500'], // 指定接收的地址
	methods: ['GET', 'POST'], // 指定接收的请求类型
	alloweHeaders: ['Content-Type', 'Authorization'] // 指定header
}))

// 监听端口
app.listen(5500)
console.log('success listen at port:5500......')