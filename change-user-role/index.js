const { ILert } = require("ilert");
require("dotenv").config();

const roles = [ "STAKEHOLDER", "RESPONDER", "USER", "ADMIN" ];

if(!process.env.ILERT_API_KEY) {
    throw new Error("It seems your api key is missing!");
}

const ilert = new ILert({
    apiKey: process.env.ILERT_API_KEY
});

const getUserByEmail = async (email) => {
    const user = await ilert.call("POST", {email}, "/users/search-email", null);
    return user.data;
}

const checkUserRole = (user, role) => {
    console.log(user.id, user.role, "->", role);
    if (user.role == role) {
        throw new Error("This User already got the role!");
    } else if(!roles.includes(role)) {
        throw new Error("Not a valid role! Available roles: " + roles);
    }
    return;
}

const getUsersTeams = async (user) => {
    const teamsOfUser = await ilert.call("GET", null ,"/teams", {"members": user.id});
    const teamsFromUserArray = Array.from(teamsOfUser.data);
    return teamsFromUserArray;
}

const removeUserFromTeams = async (teams, user) => {
    const tempTeams = [];
    await Promise.all(teams.map(async element => {
        await ilert.call("DELETE", null ,`/teams/${element.id}/members/${user.id}`);
        if(!tempTeams.includes(element)) {
            tempTeams.push(element);
        }
        console.log(user.id + " removed from " + element.name);
    }));
    return tempTeams;
}

const changeUsersRole = async (user, role) => {

    if(roles.includes(role)) {
        user.role = role;
        const change = await ilert.call("PUT", user, `/users/${user.id}`);
        return change;
    } else {
        throw new Error("Not a valid role! Available roles: " + roles)
    }
}

const addUserToSavedTeams = async (teams, user) => {
    await Promise.all(teams.map(async element => {
        await ilert.call("POST", {user, role: user.role }, `/teams/${element.id}/members`); 
        console.log(user.id + " added to " + element.name);
    }));
}

const main = async (userEmail, role) => {

    try {
        const user = await getUserByEmail(userEmail);
        checkUserRole(user, role);
        const teams = await getUsersTeams(user);
        if(teams.length != 0) {
            const tempTeams = await removeUserFromTeams(teams, user);
            const change = await changeUsersRole(user, role);
            const addUserToTeams = await addUserToSavedTeams(tempTeams, user);
        } else {
            const change = await changeUsersRole(user, role);
            console.log("User role was changed no teams found");
        }
    } catch(error) {
        console.log(error.message);
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
            
        } else if(value.startsWith("role")) {
            const temp = value.split("=");
            role = temp[1];
        }
    });

    if(email && role) {
        email = email.replace('"', '');
        role = role.replace('"', '');
        main(email, role);
    } else {
        throw new Error("Not enought arguments given");
    }

} catch (error) {
    console.error(error);
}
