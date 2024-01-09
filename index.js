const { ILert } = require("ilert");
require("dotenv").config();

if(!process.env.ILERT_API_KEY) throw new Error("It seem your Api key is missing!");
const ilert = new ILert({
    apiKey: process.env.ILERT_API_KEY
});

const roles = ["STAKEHOLDER", "RESPONDER", "USER", "ADMIN"];
let tempTeams = [];

const getUserByEmail = async (useremail) => {
    const user = await ilert.call("POST", {email: useremail}, "/users/search-email", null);
    return user.data;
}

const checkUserRole = async (user, role) => {
    console.log(user.role);
    if(user.role == role) {
        throw new Error("This User already got the role!");
    }else if(!roles.includes(role)) {
        throw new Error("Not a valid Role! Available Roles: " + roles)
    }
    return;
}

const getUsersTeams = async (user) => {
    let teamsFromUser = await ilert.call("GET", null ,"/teams", {"members": user.id});
    const teamsFromUserArray = Array.from(teamsFromUser.data);
    return teamsFromUserArray;
}

const removeUserFromTeams = async (teams, user) => {
    await teams.forEach(element => {
        ilert.call("DELETE", null ,`/teams/${element.id}/members/${user.id}`);
        if(!tempTeams.includes(element)) {
            tempTeams.push(element);
        }
        console.log(user.id + " removed from " + element.name);
    });     
}

const changeUsersRole = async (user, role) => {
    if(roles.includes(role)) {
        user.role = role;
        const change = await ilert.call("PUT", user, `/users/${user.id}`);
        return change;
    }else {
        throw new Error("Not a valid Role! Available Roles: " + roles)
    }
    
}

const addUserToSavedTeams = async (teams, user) => {
    await teams.forEach(element => {
        ilert.call("POST", {user, role: user.role }, `/teams/${element.id}/members`); 
        console.log(user.id + " added to " + element.name);
    });
}

const main = async (useremail, role) => {
    try {
        const user = await getUserByEmail(useremail);
        const check = checkUserRole(user, role);
        const teams = await getUsersTeams(user);
        if(teams.length != 0) {
            const remove = await removeUserFromTeams(teams, user);
            const change = await changeUsersRole(user, role);
            const addUserToTeams = await addUserToSavedTeams(tempTeams, user);
        }else {
            const change = await changeUsersRole(user, role);
            console.log("User Role was changed no Teams found");
        }
            
    }catch(error) {
        throw error;
    }
}


//Arguments syntax email={email} role={role}
try {
    const args = process.argv
    let email;
    let role;
    args.map((value) => {
        if(value.startsWith("email")) {
            const temp = value.split("=");
            email = temp[1];
            
        }else if(value.startsWith("role")) {
            const temp = value.split("=");
            role = temp[1];
        }
    });
    if(email && role) {
        email = email.replace('"', '');
        role = role.replace('"', '');
        main(email, role);
    }else {
        throw new Error("Not enought Arguments given");
    }
    
}catch (error) {
    console.error(error);
}
