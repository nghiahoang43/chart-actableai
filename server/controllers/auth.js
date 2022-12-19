import { User } from '../models/user.js'
import { OK, NOT_FOUND, FAIL } from "../shared/response.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Configuration, OpenAIApi } from "openai";

const plotData = async (req, res) => {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
    try {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Generate JSON object for the below and convert all numbers to strings:\n ${req.body.formData}`,
        temperature: 0.1,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      return res.send(OK([completion.data.choices[0].text]))
    }
    catch (error) {
        console.log(error)
    }
}


const signup = async (req, res) => {

    const { username, email, password } = req.body;
    try {
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.send(FAIL('Email already exist'));
        }
        const encryptedPassword = await bcrypt.hash(password, 10);
        let user = await User.create({
            username,
            email,
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;
        return res.send(OK([user]))
    } catch (error) {
        return res.send(FAIL(error));
    }
}

const login = async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;
        // Validate user input
        if (!(email && password)) {
            return res.send(FAIL("All input is required"));
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });
        let isCorrectPassword = await bcrypt.compare(password, user.password)
        let tokenUser = { user_id: user._id, email };
        if (user && isCorrectPassword) {
            // Create token
            const token =  jwt.sign(
                tokenUser
                ,
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            // save user token
            res.cookie('x-access-token',token)
            // user
            return res.send(OK([{auth: true, token: token, user: user}]));
        }
        return res.send(FAIL("Wrong username/password combination"));
    } catch (err) {
        return res.send(FAIL("No user exists"));
    }
}

export {plotData, signup, login }