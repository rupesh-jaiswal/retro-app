const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase();

    //validate the data

    if(!username || !room) {
        return {
            error: 'username and room are required'
        }
    }

    // Check for exisiting user

    const exisitingUser = users.find((user) => {
        return user.room === room && user.username ===username
    });

    //Validate usename
    if(exisitingUser) {
        return {
            error: 'username is in use!'
        };
    }

    // Store USer

    const user = { id, username, room }
    users.push(user);

    return { user };
}


const removeUser = (id) => {
    const index = users.findIndex((user) => user.id===id);
    if(index!==-1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id);
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room);
}


module.exports = {
    addUser,
    removeUser,
    getUsersInRoom,
    getUser,
};
