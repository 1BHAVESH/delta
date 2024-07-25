const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'radha'
});

let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),
    ];
}
//home route
app.get("/", (req, res) =>{

    let q = `SELECT COUNT(*) FROM user`;

try {
    connection.query(q, (err, result) => {
        if (err) throw err;
        let count = result[0]["COUNT(*)"];
        res.render("index.ejs", {count});       
    });
} catch (err) {
    res.send("some err in DB");
    console.log(err);
}
})

app.get("/user", (req, res) =>{
    let q  = `SELECT * FROM user`;
    try {
        connection.query(q, (err, users) => {
            if (err) throw err;
            
            // res.send(result); 
            res.render("showuser.ejs", {users});      
        });
    } catch (err) {
        res.send("some err in DB");
        console.log(err);
    }
    
})

app.get("/user/:id/edit", (req, res) =>{

    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            
            let user = result[0];
            // res.send(result); 
            res.render("edit.ejs", {user});      
        });
    } catch (err) {
        res.send("some err in DB");
        console.log(err);
    }
})

// update (DB) route

app.patch("/user/:id", (req, res) =>{

    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
    let {password: formPassword, username: newUsername} = req.body;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            
            let user = result[0];
            if(formPassword != user.password){
                res.send("Wrong password");
            }
            else{
                let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
                connection.query(q2, (err, result) =>{
                    if (err) throw err;
                    res.redirect("/user");
            })
            }      
        });
    } catch (err) {
        res.send("some err in DB");
        console.log(err);
    }
})

app.get("/user/new", (req, res) =>{

    res.render("new.ejs");


})
app.post("/user/new", (req, res) =>{
    let {username, password, email} = req.body;
    let id = uuidv4();

    let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;

    try{
        connection.query(q, (err, result) =>{
            if(err) throw err;
            console.log("added new user");
            res.redirect("/user");
        })
    }catch{
        res.send("some error occur");
    }
})

app.get("/user/:id/delete", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        let user = result[0];
        res.render("delete.ejs", { user });
      });
    } catch (err) {
      res.send("some error with DB");
    }
  });

app.delete("/user/:id", (req, res) =>{

    let {id} = req.params;
    let{password} = req.body;

    let q = `SELECT * FROM user WHERE id='${id}'`;

    try{
        connection.query(q, (err, result) =>{
            let user = result[0];
            if(user.password != password){

                res.send("you entered wrong password");
            }
            else{
                let q2 = `DELETE FROM user WHERE id='${id}'`; //Query to Delete
                connection.query(q2, (err, result) =>{
                    if(err) throw err;
                    else {
                        console.log(result);
                        console.log("deleted!");
                        res.redirect("/user");
                      }
                })
            }
        })
    }catch{
        res.send("some error in db");
    }

    


})

app.listen(port, () =>{
    console.log("server is listning to posr ",port);
})



// let q = "SHOW TABLES";
// let q = "INSERT INTO user (id, username, email, password) VALUES ?";
// let data = [];

// for(let i = 1; i <= 100; i++){

//     data.push(getRandomUser());
// }

// try {
//     connection.query(q,[data], (err, result) => {
//         if (err) throw err;
//         console.log(result); 
       
//     });
// } catch (err) {

//     console.log(err);
// }

// connection.end(); 
