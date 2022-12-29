const mongoose = require('mongoose')
const{Schema, model} =mongoose;

const blogschem = new Schema({
    Employee_id: String,
    Personal_id: String,
    Title: String,
    First_name: String,
    Last_name: String,
    DOB: String,
    Mobile_Number: String,
    City: String,
    Address: String,
    Email: String,
    Postal_code: String,
    Qualification: String,
    Current_experience: String,
    Start_date: String,
    End_date: String,
    Type_of_employee: String,
    Gender: String,
    Marital_Status: String,
    Role: String,
    Project_Domain: String
})
const Blog = new model("emp_Basic_Info",blogschem);
module.exports = 'Blog';