
const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const uri = "Your connecting string";
const client = new MongoClient(uri);

const dbname = "Employee_information"

app.use(express.json());

async function getData() {
    const result = await client.connect();
    db1 = result.db(dbname);
    collection = db1.collection('emp_Basic_Info')
    const finaldata = await collection.find({}).toArray();
    // console.log(finaldata)
    return finaldata;
}

async function UserCheck(Username, password) {
    const result = await client.connect();
    db1 = result.db(dbname);
    collection = db1.collection('User_Access_controls')
    const finaldata = await collection.find({ "User_Name": { $eq: Username }, "Password": { $eq: password } }).toArray();
    return finaldata;
}

async function FindEmpdata(Empid) {
    const result = await client.connect();
    db = result.db(dbname);
    collection = db.collection('emp_Basic_Info');
    const finaldata = await collection.find({ "Employee_id": { $eq: Empid } }).toArray();
    return finaldata;
}
async function LeaveApproval(empid, name, from, to, type, comment) {
    //console.log(empid, name, from, to, type, comment)
    const result = await client.connect();
    db = result.db(dbname);
    collection = db.collection('Emp_LeaveApproval');
    const finaldata = await collection.insertOne(
        {
            "Employee_id": empid,
            "Name": name,
            "Leave_From": from,
            "Leave_To": to,
            "Type_of_Leave": type,
            "Reason_For_Leave": comment,
            "Approval_Status": 0
        })
    return finaldata
}

async function EmpAprovals(empid) {
    const result = await client.connect();
    db = result.db(dbname);
    collection = db.collection('Emp_LeaveApproval');
    const finaldata = await collection.find({ "Employee_id": { $eq: empid } }).toArray();
    return finaldata;
}

async function getAllApprovals() {
    const result = await client.connect();
    db = result.db(dbname);
    collection = db.collection('Emp_LeaveApproval');
    const finaldata = await collection.find({ "Approval_Status": 0 }).toArray();
    return finaldata;
}

async function ApproveRequest(ApprovalID) {
    const result = await client.connect();
    db = result.db(dbname);
    collection = db.collection('Emp_LeaveApproval');
    const finaldata = await collection.updateOne({ "Employee_id": ApprovalID }, { $set: { "Approval_Status": 1 } }) //Approve Leave
    console.log("dbcaller", finaldata)
    return finaldata;
}


async function CancelApprovals(ApprovalID) {
    const result = await client.connect();
    db = result.db(dbname);
    collection = db.collection('Emp_LeaveApproval');
    const finaldata = await collection.updateOne({ "Employee_id": ApprovalID }, { $set: { "Approval_Status": 2 } }) //Cancel leave

    return finaldata;
}

async function CollectDept() {
    const result = await client.connect();
    db = result.db(dbname);
    collection = db.collection('Emp_departments');
    const finaldata = await collection.find({}).toArray();
    //console.log("dbcaller", finaldata)
    return finaldata
}

async function UpdateEmpDetails(Employee_id, Updateddetails) {
    const result = await client.connect();
    db = result.db(dbname);
    collection = db.collection('emp_Basic_Info')
    var findingEmpData = await collection.find({ "Employee_id": { $eq: Employee_id } }).toArray();
    // findingEmpData = await FindEmpdata[0]
    // console.log('findingEmpData',findingEmpData)

    collection = db.collection('Temp_emp_Doc');
    const finaldata = await collection.find({ "Employee_id": { $eq: Employee_id } }).toArray();
    //Get data from old collection and find the data is available in temp data.
    if (finaldata.length === 0 || !finaldata.length) {
        console.log("console data not available")
        const Rtn_data = await Insertdata('Temp_emp_Doc', findingEmpData[0])
        // return Rtn_data;
    }
    else {
        console.log("Data already available")
        await collection.deleteOne({ Employee_id: { $eq: Employee_id } });
        const Rtn_data = await Insertdata('Temp_emp_Doc', findingEmpData[0]);
        // return Rtn_data;
    }
    collection = db.collection('emp_Basic_Info');
    await collection.deleteOne({ Employee_id: { $eq: Employee_id } });
    const Rtn_data = await Insertdata('emp_Basic_Info', Updateddetails);
    //console.log("Rtn_data", Rtn_data);
    return Rtn_data;
}

async function NewEmployee(Emp_info) {
    const result = await client.connect();
    db = result.db(dbname);
    const finaldata = await Insertdata('emp_Basic_Info', Emp_info);
    // console.log('Finaldata', finaldata);
    // console.log(Emp_info.Employee_id)
    //-----Creating user and pass level-------
    collection = db.collection('User_Access_controls')
    const Rtn_usercreation = await collection.insertOne(
        {

            "User_Name": Emp_info.Employee_id,
            "Password": Emp_info.Employee_id,
            "Access_Code": 1
        }
    )
    if (finaldata.insertedId === null && Rtn_usercreation.insertedId === null) {

        return false
    }
    else {
        return true
    }
}




//---------------------------Private Functions------------------------------
async function Insertdata(dbname, findingEmpData) {
    // console.log('Insertdata', findingEmpData)
    //console.log('Check', findingEmpData.Employee_id)
    collection = db.collection(dbname);
    const finalUpdateddata = await collection.insertOne(
        {

            "Employee_id": findingEmpData.Employee_id,
            "Personal_id": findingEmpData.Personal_id,
            "Title": findingEmpData.Title,
            "First_name": findingEmpData.First_name,
            "Last_name": findingEmpData.Last_name,
            "DOB": findingEmpData.DOB,
            "Mobile_Number": (findingEmpData.Mobile_Number).toString(),
            "City": findingEmpData.City,
            "Address": findingEmpData.Address,
            "Email": findingEmpData.Email,
            "Postal_code": findingEmpData.Postal_code,
            "Qualification": findingEmpData.Qualification,
            "Start_date": "",
            "End_date": "",
            "Type_of_employee": findingEmpData.Type_of_employee,
            "Gender": findingEmpData.Gender,
            "Marital_Status": findingEmpData.Marital_Status,
            "Role": findingEmpData.Role,
            "Project_Domain": findingEmpData.Project_Domain,
            "Department": findingEmpData.Department
        }
    )
    //  console.log(finalUpdateddata)
    return finalUpdateddata
}

client.close()

module.exports = { NewEmployee, getData, UserCheck, FindEmpdata, LeaveApproval, EmpAprovals, getAllApprovals, ApproveRequest, CancelApprovals, CollectDept, UpdateEmpDetails };