const adminModel = require("../model/adminModel")
const studentModel = require("../model/studentModel")
const jwt = require('jsonwebtoken')
const {
    isValidEmail,
    isValidPwd,
    isValidBody,
    isValidName } = require("../validation/validation.js")


// admin registration

const adminRegister = async function (req, res) {
    try {
        let data = req.body
        console.log(data)

        // destucturing
        let { firstName: firstName, lastName: lastName, email: email, password: password } = data

        // validations
        if (isValidBody(data)) {
            return res.status(400).send({ status: false, message: "please provide request body" });
        }

        if (!firstName) {
            return res.status(400).send({ status: false, message: "first name is mandatory" })
        }

        if (!lastName) {
            return res.status(400).send({ status: false, message: "last name is mandatory" })
        }

        if (!email) {
            return res.status(400).send({ status: false, message: "email is mandatory" })
        }

        if (!password) {
            return res.status(400).send({ status: false, message: "password is mandatory" })
        }

        if (!isValidName(firstName)) {
            return res.status(500).send({ status: false, message: "please enter valid first name " })
        }

        if (!isValidName(lastName)) {
            return res.status(500).send({ status: false, message: "please enter valid last name " })
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "EmailId is not valid " })
        }

        if (!isValidPwd(password)) {
            return res.status(400).send({
                status: false,
                message: "Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters",
            });
        }

        // checking if the credentials of admin login is same 
        let CheckUser = await adminModel.findOne({ email: email, password: password })

        if (CheckUser) {
            return res.status(200).send({ status: false, message: "you are already registered please go to log in page " })
        }

        // creating new entry
        let CreatLogIn = await adminModel.create(data)
        return res.status(201).send({ status: true, message: "admin created successfully", data: CreatLogIn })
    }
    catch (error) {
        res.status(500).send({ status: fasle, message: error.message })
    }
}


// ----------------------------------//////////////////////////=------------------------------------


// Admin login


const logInAdmin = async function (req, res) {
    try {
        let data = req.body

        // destucturing
        let { email, password } = data

        // validations
        if (isValidBody(req.body)) {
            return res.status(400).send({ status: false, msg: "please input email and password" })
        }

        if (!email) {
            return res.status(400).send({ status: false, message: "EmailId is mandatory" })
        }

        if (!password) {
            return res.status(400).send({ status: false, message: "Password is mandatory" })
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Please Provide valid email id " })
        }


        if (!isValidPwd(password)) {
            return res.status(400).send({
                status: false,
                message: "Password should be 8-15 characters long and must contain one of 0-9,A-Z,a-z and special characters",
            });
        }

        // findind crdentials in database to login
        let CheckUser = await adminModel.findOne({ email: email, password: password })

        if (CheckUser) {
            // saving user id as admin id
            req.adminId = CheckUser._id

            // creating token
            let token = jwt.sign(
                {
                    adminId: CheckUser._id.toString(),
                    batch: "Plutonium",
                    organisation: "tailwebBackendTaskProject, Plutonium-Batch"
                },
                "Admin-student-login-panel", {

                expiresIn: '10h' // expiration

            });
            return res.status(201).send({ status: true, message: "Admin logged In successfully", message: token })
        }
        else {
            return res.status(400).send({ status: false, message: " please register yourself before login " })
        }

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { adminRegister, logInAdmin }