import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GlobalNavbar from './GlobalNavbar';

const Signup = () => {
    const [username, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const navigate = useNavigate();
    const navigateLogin = () => {
        navigate('/login')
    }

    const signup = async (e) => {
        e.preventDefault()
        let ifSuccess = await axios.post(
            "http://localhost:2000/signup",
            {
                username: username,
                email: email,
                password: pwd,
            }
        );
        if (!ifSuccess.data.success) {
            setErrMsg(ifSuccess.data.message);
        }
        else {
            navigateLogin();
        }
    }

    return (
        <div>
            <GlobalNavbar />
            <div className="Auth-form-container">
                <form className="Auth-form" onSubmit={signup}>
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Sign Up</h3>
                        <div className="text-center">
                            Already registered?{" "}
                            <span className="link-primary login-text" onClick={navigateLogin}>
                                Log In
                            </span>
                        </div>
                        <div className="form-group mt-3">
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control mt-1"
                                placeholder="Username"
                                onChange={(e) => { setUserName(e.target.value) }}
                                required
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Email address</label>
                            <input
                                type="email"
                                className="form-control mt-1"
                                placeholder="Email Address"
                                onChange={(e) => { setEmail(e.target.value) }}
                                required
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control mt-1"
                                placeholder="Password"
                                onChange={(e) => { setPwd(e.target.value) }}
                                required
                            />
                        </div>
                        <p className="error-message">{errMsg}</p>
                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn customize-btn2">
                                Signup
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default Signup;