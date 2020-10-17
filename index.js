const express = require("express");
const path = require("path");
const axios = require("axios");
const sql = require("mssql");
const debug = require("debug");
const {Connection, Request} = require("tedious");

var app = require('express')();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data


let port = process.env.PORT || 4000;

let prouter = require("./routes/profileRoute");
const { connect } = require("http2");
app.set("view engine", "ejs");

//set the index.ejs location for the '/' path
app.set("views", "./views/");

//define static files usage
app.use(express.static(path.join(__dirname, "public")));
app.use("./views/index", (data) => prouter(data));

//mssql config
/*  const config = {
    server: 'profiledb.database.windows.net',
    userName : 'dbadmin',
    password : 'db@dm1n@2020',
    database : 'profiledb',
    options : {encrypt : true, enableArithAbort: false}
} */
/*  const config =  {
  server: 'profiledb.database.windows.net',
  database: 'dbadmin',
  userName: 'profiledb',
  password: 'db@dm1n@2020',
  port: 433
 };  */

// Create connection to database
   const config = {
    authentication: {
      options: {
        userName: "dbadmin", // update me
        password: "db@dm1n@2020" // update me
      },
      type: "default"
    },
    server: "profiledb.database.windows.net", // update me
    options: {
      database: 'profiledb',
      encrypt: true,
      enableArithAbort: true
    }
  };  

/*     var config = {
    server: 'profiledb.database.windows.net',
    database: 'profiledb',
    user: 'dbadmin',
    password: 'db@dm1n@2020',
    port: 443,
    options: {
      database: 'profiledb',
      encrypt: true,
      enableArithAbort: true
    }
   };   */

/*  let sql_connect = sql.connect(config).catch((err) => {
    debug(err);
});   */ 

const connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
/* connection.on("connect", err => {
  if (err) {
    console.error(err.message);
  } else {
    queryDatabase();
  }
}); */

  function queryDatabase()
  {
    var dbConn = new sql.Connection(config,
      function (err) {
      var myTransaction = new sql.Transaction(dbConn);
      myTransaction.begin(function (error) {
      var rollBack = false;
      myTransaction.on('rollback',
      function (aborted) {
      rollBack = true;
      });
      new sql.Request(myTransaction)
      .query(`insert into tblprofile(id, pat_name, pat_address, pat_gender, pat_dob) values (2, ${pat_name}, ${pat_address}, ${pat_gender}, ${pat_dob})`,
      function (err, recordset) {
      if (err) {
      if (rollBack) {
        myTransaction.rollback(function (err) {
        debug(err);
      });
      }
      } else {
      myTransaction.commit().then(function (recordset) {
      console.dir('Data is inserted successfully!');
      }).catch(function (err) {
      console.dir('Error in transaction commit ' + err);
      });
      }
      });
      });
      });
  }

/* function queryDatabase() {
    console.log("Reading rows from the Table...");
    
    const trans = new sql.Transaction();
    //.input('pat_name', sql.VarChar(255), )
    const request = new sql.Request(trans);
    trans.begin( err => {
    // Read all rows from table
    if (err)
      debug(err)  
        
        request.query(`insert into tblprofile(id, pat_name, pat_address, pat_gender, pat_dob) values (2, ${pat_name}, ${pat_address}, ${pat_gender}, ${pat_dob})`, 
                (result, err) => {
                    if (err)
                        debug(err);
                    else
                        debug(result);

        trans.commit(err => {
        if (err)
            debug(err);
        console.log("transaction completed");
        });
                                    
        });
    });
    connection.execSql(request);
  } */

//app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.get("../routes/profile", (req, res)=> {
    console.log("get request");
}).post("../routes/profile", (req, res) => {
    console.log("post request");
});
app.get('/', (req, res) => {
    console.log(`sending request to ${port}`);
    res.render("index", {axios:axios});
}).post("/", upload.none(), function (req, res, next) {
    //console.log(req.body);
    //sql.connect(config, (err) => {

    //})
    console.log("processing post request");
    let req_data = req.body;
    let pat_name = req_data.data.pat_name;
    let pat_address = req_data.data.pat_address;
    let pat_gender = req_data.data.pat_gender;
    let pat_dob = req_data.data.pat_dob;
    
        var dbConn = new sql.connect(config,
          function (err) {
          var myTransaction = new sql.Transaction(dbConn);
          myTransaction.begin(function (error) {
          var rollBack = false;
          myTransaction.on('rollback',
          function (aborted) {
          rollBack = true;
          console.log("connection established!");
          });
          new sql.Request(myTransaction)
          .query(`insert into tblprofile(id, pat_name, pat_address, pat_gender, pat_dob) values (2, ${pat_name}, ${pat_address}, ${pat_gender}, ${pat_dob})`,
          function (err, recordset) {
           if (err) {
          if (!rollBack) {
          myTransaction.rollback(function (err) {
          console.debug("error:",err);
          });
          } 
          } else {
          myTransaction.commit().then(function (recordset) {
          console.log('Data is inserted successfully!');
          }).catch(function (err) {
          console.log('Error in transaction commit ' + err);
          });
          }
          });
          });
          });
 
  
    //console.log(req_data.data.pat_name);

    /* const trans = new sql.Transaction(sql_connect);
    //.input('pat_name', sql.VarChar(255), )
    trans.begin( err => {
        const request = new sql.Request(trans);
        request.query(`insert into tblprofile(id, pat_name, pat_address, pat_gender, pat_dob) values (2, ${pat_name}, ${pat_address}, ${pat_gender}, ${pat_dob})`, 
                (result, err) => {
                    if (err)
                        debug(err);
                    else
                        debug(result);
               
        });
    });
    trans.commit(err => {
        if (err)
            debug(err);
        console.log("transaction completed");
    }); */
        
}).listen('4000');
