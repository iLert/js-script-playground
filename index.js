const { ILert } = require("ilert");
require("dotenv").config();

const ilert = new ILert({
    apiKey: process.env.ILERT_API_KEY
});

const roles = ["STAKEHOLDER", "RESPONDER", "USER", "ADMIN"];

const getUserByEmail = async (useremail) => {
    const user = await ilert.call("POST", {email: useremail}, "/users/search-email");
    return user.data;
}

const checkUserRole = async (user, role) => {
    if(user.role == role) {
        throw new Error("This User already got the role!");
    }
    return false;
}

const getUsersTeams = async (user) => {
    const teamsFromUser = await ilert.call("GET","/teams", {"member": user.id});
    return teamsFromUser;
}

const removeUserFromTeams = async (teams, user) => {
    await teams.map((team) => {
        ilert.call("DELETE", `/teams/${team.id}/members/${user.id}`);
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
    await teams.map((team) => {
        ilert.call("POST", {user, role: user.role }, `/teams/${team.id}/members`);
    });
}

const main = async (useremail, role) => {
    try {
        const user = await getUserByEmail(useremail);
        if(checkUserRole(user)){
            const teams = await getUsersTeams(user);
            const tempTeams = teams;
            const remove = await removeUserFromTeams(tempTeams);
            const change = await changeUsersRole(user, role);
            if(checkUserRole(user)) {
                const addUserToTeams = await addUserToSavedTeams(tempTeams, user);
            }
        }
    }catch(error) {
        throw error;
    }
}


//Arguments syntax email={email} rol={role}
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
