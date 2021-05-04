const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const cors = require('cors')

const port = 3000
const saltRounds = 10;

app.use(express.json());
app.use(cors());

const getUsers = () => {
    const rawdata = fs.readFileSync(path. resolve(__dirname, 'users.json'));

    if( rawdata ){
        return JSON.parse(rawdata);
    } else {
        return [];
    }
}

const updateUsers = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users));
}

const findUser = (users, usernameOrEmail, phone) => {
    return users.filter(user => {
        return (user.usernameOrEmail === usernameOrEmail.toLowerCase()) || (user.phone === phone)
    });
}

const validateToken = (token) => {
    const users = getUsers();
    return users.filter(user => user.token === token).length > 0;
}

const checkAccess = (req, res, next) => {
    const token = req.headers.token;

    if( token && validateToken(token) ) {
        next();
    } else {
        res.send({
            message: 'Invalid token'
        });
    }
}

const rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

const token = function() {
    return rand() + rand(); // to make it longer
};

app.post('/login', async (req, res) => {
  const usernameOrEmail = req.body.email.trim();
  const password = req.body.password;
  const users = getUsers();

  const existUsers = findUser(users, usernameOrEmail, usernameOrEmail);
  if(existUsers.length === 0) {
    res.send({
        message: 'Invalid credentials'
    });
  } else {
    const user = existUsers[0];
    const match = await bcrypt.compare(password, user.password);

    if ( match ) {
        user.token = token();

        const usersList = users.map(userDetail => {
            if(userDetail.id === user.id) {
                userDetail = user;
            }

            return userDetail;
        });

        updateUsers(usersList);
        delete user.password;

        res.send({
            status: 'success',
            message: 'login success',
            user: user
        });
    } else {
        res.send({
            status: 'failure',
            message: 'Invalid credentials'
        });
    }
  }
});

app.post('/signup', async (req, res) => {
    let users = getUsers();
    const name = req.body.name;
    const usernameOrEmail = req.body.email.trim();
    const userPhone = req.body.phone;
    const password = req.body.password;

    const existUsers = findUser(users, usernameOrEmail, userPhone);

    if( password.length > 6 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
        const encryptPassword = await bcrypt.hash(password, saltRounds);

        if (existUsers.length > 0) {
            res.send({
                status: 'failure',
                message: 'User already exist'
            });
        } else {
            let user = {};
            user.id = 948 + users.length + 1;
            user.password = encryptPassword;
            user.usernameOrEmail = usernameOrEmail;
            user.phone = userPhone;
            user.name = name;
            user.token = token();

            users.push(user);
            updateUsers(users);
            
            res.send({
                status: 'success',
                message: 'User created',
                user: user
            });
        }
    } else {
        res.send({
            status: 'failure',
            message: 'Password error'
        });
    }
});

app.get('/insights', checkAccess ,(req, res) => {
    res.send({
        status: 'success',
        data: {
            countries: [
                {
                    name: 'USA',
                    flag: 'a/a4/Flag_of_the_United_States.svg',
                    cases: '32.4M',
                    recovered: '-',
                    deaths: '576K'
                }
            ]
        }
    })
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})