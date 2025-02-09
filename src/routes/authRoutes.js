import express, { application } from 'express'

//, { hash }
import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'
import db from '../db.js'
import pkg from 'bcryptjs';






const router = express.Router();


// Registering a new user endpoint /auth/register
router.post('/register', (req,res) =>{
    const {username , password} = req.body;

    //encrypting the password

    const hashedPassword = bcrypt.hashSync(password, 8);

    console.log(hashedPassword)

    try{
        const insertUser = db.prepare(`INSERT INTO users(username,password) VALUES (?,?)`);
        const result = insertUser.run(username, hashedPassword);

        // adding a first todo for the user
        const defaultTodo = `Hello! Add your first todo`;
        const insertTodo = db.prepare(`INSERT INTO todos(user_id,task) VALUES (?,?)`);
        insertTodo.run(result.lastInsertRowid, defaultTodo);

        //creating a token for authentication and authorization
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.json({ token })

    }catch(err){
        console.log(err.message)
        res.sendStatus(503)
    }
    
})

router.post('/login', (req,res) =>{
    // dealing with encryption of the password
    const {username, password} = req.body;

    try{    
        const getUSer = db.prepare(`
            SELECT * FROM users WHERE username = ?
        `)
        const user = getUSer.get(username)
        //if we cant find associated user return out 
        if(!user){
            return res.status(404).send({message: "User not found"})
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        // if pass doesnt match return out of the statement
        if(!passwordIsValid){
            return res.status(401).send({message: "Password is not valid"});
        }

        console.log(user)

        //Successful authentication 
        const token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {expiresIn: '24h'});

        res.json( {token} );
    }catch(err){
        console.log(err.message);
        res.sendStatus(503)
    }
    
})

export default router;
