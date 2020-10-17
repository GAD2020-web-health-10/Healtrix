const express = require("express");
const FormData = require("form-data");
const sql = require("mssql");

const profilesRouter = (data) =>
{
    const config = {
        server: 'psbooklibrarydb.database.windows.net',
        username : 'dbadmin',
        password : 'db@dm1n2020',
        options : {encrypt : true}
    }
    sql.connect(config);
/*     
    */
    /* let form = new FormData();
    form.append("pat_name", document.getElementById("pat_name").value);
    form.append("pat_address", document.getElementById("pat_add").value);
    //if (document.getElementById("pat_genm").value)
    form.append("pat_gender",document.getElementById("pat_genf").value);
    form.append("pat_dob", document.getElementById("pat_dob").value);  */
     for (const data of data)
        console.log(data);
}    
//let app = express();
//profilesRouter(data);
module.exports = profilesRouter;
