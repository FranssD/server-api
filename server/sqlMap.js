// sql语句
let sqlMap = {
	// 用户
	user: {
		add: "insert into user(id, name, pwd) values (0, ?, ?)", // 添加用户
		GetList: "select * from user",
		auth: {
			selectName: "select * from user where name =", // 查询 username
			selectPwd: "select * from user where pwd =", // 查询 selectPwd
			selectAndPwd: "and pwd =" // 查询username 和 selectAndPwd
		}
	}
};
module.exports = sqlMap;
