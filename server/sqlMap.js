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
	},
	//路由
	routes: {
		GetList: "select * from routes ",//查询路由权限
		auth: {
			selectStatusChild: "select * from routes_children where status =", //查询下面的子集
			selectGrade: "where grade ="
		}
	}
};
module.exports = sqlMap;


