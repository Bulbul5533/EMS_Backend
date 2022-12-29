
const express = require('express');
const dbcaller = require('./DBServer.js');
const cors = require('cors');
const { json } = require('body-parser');

const app = express();
app.use(express.json());
app.use(cors());

// app.all("/*", function(req, res, next){
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Accept', 'application/json');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// ---------------------------------End of Importing files----------------------------------------------

//------------------------------------------Listing-----------------------------------------------------

app.listen(3000, () => {
  console.log('port Activated')
})

//------------------------------------------End of Listing----------------------------------------------

//------------------------------------------Request and response----------------------------------------------------

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   next();
// })

app.post("/getAllEmployee", async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const result = await dbcaller.getData()
    res.send(JSON.stringify(result));
  }
  catch (err) {
    res.status(500).send(json.stringify(err))
  }
})

app.post("/Login/:user/:pass", async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    user = req.params.user;
    pass = req.params.pass;
    const returndata = await dbcaller.UserCheck(user, pass)
    if (JSON.stringify(returndata) === '[]') {

      res.send(JSON.stringify("Unauthorized"))
    }
    else {
      res.status(200).send(JSON.stringify(returndata));
    }
  }
  catch (err) {
    res.status(500).send(json.stringify(err))
  }

})


app.post("/find/empinfo/:user", async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    user = req.params.user;
    const returndata = await dbcaller.FindEmpdata(user)
    res.status(200).send((returndata));
  }
  catch (err) {
    res.status(500).send(json.stringify(err))
  }
})

app.post("/Emp/LeaveApproval/:userinfo", async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const combined_date = req.params.userinfo;
    const data = combined_date.split("$")
    const empid = data[0]
    const name = data[1]
    const from = data[2]
    const to = data[3]
    const type = data[4]
    const comment = data[5]
    //console.log(combined_date)
    //console.log(data[0])
    const returndata = await dbcaller.LeaveApproval(empid, name, from, to, type, comment);
    if (returndata.acknowledged === true) {
      res.status(200).send(true)
    }
    else// if(returndata.acknowledged === false)
    {
      res.status(400).send(false)
    }
  }
  catch (err) {
    res.status(500).send(json.stringify(err))
  }
})


app.post("/Emp/Find/MyApprovals/:empid", async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const empid = req.params.empid;
    const returndata = await dbcaller.EmpAprovals(empid);
    if (returndata === null) {
      res.status(200).send(JSON.stringify("Null"))
    }
    else {
      res.status(200).send(returndata)
    }
  }
  catch (err) {
    res.status(500).send(json.stringify(err))
  }
})

app.post("/Emp/FindAll/allRequests", async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const returndata = await dbcaller.getAllApprovals();
    if (returndata === null) {
      res.status(200).send(JSON.stringify("No Approvals Pending"))
    }
    else {
      res.status(200).send(returndata)
    }
  }
  catch (err) {
    res.status(500).send(json.stringify(err))
  }

})

app.post("/Admin/Approve/:ApprovalID", async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const ApprovalID = req.params.ApprovalID
    const returndata = await dbcaller.ApproveRequest(ApprovalID);
    console.log("index", returndata)
  }
  catch (err) {
    res.status(500).send(json.stringify(err))
  }

})


app.post("/Admin/cancelApproval/:ApprovalID", async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const ApprovalID = req.params.ApprovalID
    const returndata = await dbcaller.CancelApprovals(ApprovalID);
  }
  catch (err) {
    res.status(500).send(json.stringify(err))
  }
})

app.post("/Admin/CollectDept", async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const returndata = await dbcaller.CollectDept();
    res.status(200).send(returndata)
  }
  catch (err) {
    res.status(500).send(json.stringify(err));
  }
})

app.post("/Admin/AddEmployee/:details", async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  // const returndata = await dbcaller
})

app.post("/emp/editinfo/:empid", async (req, res) => {
  try {
    const Employee_id = req.params.empid
    res.setHeader('Access-Control-Allow-Origin', '*')
    const returndata = await dbcaller.UpdateEmpDetails(Employee_id, req.body)
    if (returndata.acknowledged === true) {
      res.status(200).send(JSON.stringify("Data_Updated"))
    }
    else {
      res.status(200).send(JSON.stringify("Not"))
    }
  }
  catch (err) {
    res.status(500).send(json.stringify(err));
  }
})


app.post("/adm/newemp/", async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const returndata = await dbcaller.NewEmployee(req.body)
    if (returndata === true) {
      res.status(200).send(returndata)
    }
    else {
      res.status(200).send(returndata)
    }

  }
  catch (err) {
    res.status(500).send(json.stringify(err));
  }
})


//------------------------------------------End of Request and response----------------------------------------------------