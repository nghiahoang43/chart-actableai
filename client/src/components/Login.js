import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'
import './CustomizeBtn.css'
import Context from '../user/Context';
import GlobalNavbar from './GlobalNavbar';
import axios from 'axios';
const Login = () => {
    const context = useContext(Context)
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate();
    const navigateSignup = () => {
        navigate('/signup')
    }

    const login = async (e) => {
        e.preventDefault()
        let response = await axios.post(
            "http://localhost:2000/login",
            {
                email: email,
                password: pwd,
            }
        );
        if (response.data.code === 200) {
            context.loginUser(response.data.resources[0].user)
            navigate('/')
        }
        else {
            setErrMsg(response.data.message)
        }
    }

    return (
        <div className='form-container'>
            <GlobalNavbar />
            <div className='Auth-form-container'>
                <form className="Auth-form" onSubmit={login}>
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Log In</h3>
                        <div className="text-center">
                            Not registered yet?{" "}
                            <span className="link-primary login-text" onClick={navigateSignup}>
                                Sign Up
                            </span>
                        </div>
                        <div className="form-group mt-3">
                            <label>Email address</label>
                            <input
                                type="email"
                                className="form-control mt-1"
                                placeholder="Enter email"
                                onChange={(e) => { setEmail(e.target.value) }}
                                required
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control mt-1"
                                placeholder="Enter password"
                                onChange={(e) => { setPwd(e.target.value) }}
                                required
                            />
                        </div>
                        <p className="error-message">{errMsg}</p>
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn customize-btn2">
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;