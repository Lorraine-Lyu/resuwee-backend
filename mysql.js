var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Lorraine0319",
  database: "user_accounts",
});

async function startServer(){
    con.connect(function(err) {
        if (err) throw err;
        console.log("Database Connected!");
      });   
}

async function createTable(){
    var sql = "CREATE TABLE resuwee_users (name VARCHAR(255), password VARCHAR(255), profile VARCHAR(255), style VARCHAR(255))";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
}

// createTable()

async function register(user){
    return new Promise((resolve, reject) => {
        var sql = "INSERT INTO resuwee_users (name,password, profile, style) VALUES ( '" + user.name+ "', '"+ user.password+"', '" + user.profile+ "', '"+ user.style+"')";
        con.query(sql, function (err, result) {
        if (err) reject(err);
        // console.log("1 record iserted");
        resolve("1 record inserted");
        });
})};

async function login(user){
    return new Promise((resolve, reject) => {
        var sql = "SELECT * from resuwee_users where name='"+user.name+"'AND password='" + user.password+"'";
        con.query(sql, function (err, result) {
            if (err) reject(err);
            // console.log(result);
            resolve(result)
        });
    })   
}

async function update(user) {
    return new Promise((resolve, reject) => {
        var sql = "UPDATE resuwee_users SET profile='"+user.profile+"' WHERE name = '"+user.name+"'";
        con.query(sql, function (err, result) {
            if (err) reject(err);
            console.log(result.affectedRows + " record(s) updated");
            resolve(result);
        });
    })
}

module.exports.login = login;
module.exports.register = register;
module.exports.startServer = startServer;

