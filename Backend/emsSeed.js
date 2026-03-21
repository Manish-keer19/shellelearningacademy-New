const mongoose = require("mongoose");
const User = require("./models/User");
const Profile = require("./models/Profile");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const database = require("./config/database");

async function seedEMS() {
    try {
        await database.connect();

        // 1. Create Super Admin
        const superAdminEmail = "superadmin@ems.com";
        const superAdminExists = await User.findOne({ email: superAdminEmail });

        if (!superAdminExists) {
            console.log("Creating Super Admin...");
            const hashedPassword = await bcrypt.hash("manishS", 10);

            const profile = await Profile.create({
                gender: "Male",
                dateOfBirth: "",
                about: "Super Administrator",
                contactNumber: "9999999999",
            });

            await User.create({
                fullName: "Super Admin",
                email: superAdminEmail,
                password: hashedPassword,
                accountType: "Super Admin",
                active: true,
                approved: true,
                additionalDetails: profile._id,
                image: `https://api.dicebear.com/6.x/initials/svg?seed=Super Admin`,
            });
            console.log("Super Admin created successfully.");
        } else {
            console.log("Super Admin already exists.");
        }

        // 2. Create Manager
        const managerEmail = "manager@ems.com";
        const managerExists = await User.findOne({ email: managerEmail });

        if (!managerExists) {
            console.log("Creating Manager...");
            const hashedPassword = await bcrypt.hash("manishS", 10);

            const profile = await Profile.create({
                gender: "Female",
                about: "General Manager",
                contactNumber: "8888888888",
            });

            await User.create({
                fullName: "Manager One",
                email: managerEmail,
                password: hashedPassword,
                accountType: "Manager",
                active: true,
                approved: true,
                additionalDetails: profile._id,
                image: `https://api.dicebear.com/6.x/initials/svg?seed=Manager One`,
            });
            console.log("Manager created successfully.");
        } else {
            console.log("Manager already exists.");
        }

        // 3. Create Employee
        const employeeEmail = "employee@ems.com";
        const employeeExists = await User.findOne({ email: employeeEmail });

        if (!employeeExists) {
            console.log("Creating Employee...");
            const hashedPassword = await bcrypt.hash("Employee@123", 10);

            const profile = await Profile.create({
                gender: "Male",
                about: "Sales Employee",
                contactNumber: "7777777777",
            });

            await User.create({
                fullName: "Employee One",
                email: employeeEmail,
                password: hashedPassword,
                accountType: "Employee",
                active: true,
                approved: true,
                additionalDetails: profile._id,
                image: `https://api.dicebear.com/6.x/initials/svg?seed=Employee One`,
            });
            console.log("Employee created successfully.");
        } else {
            console.log("Employee already exists.");
        }

        process.exit(0);

    } catch (error) {
        console.error("Error seeding EMS:", error);
        process.exit(1);
    }
}

seedEMS();
