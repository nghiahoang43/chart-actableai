import './GlobalNavbar.css'
import './CustomizeBtn.css'
import { useContext } from 'react';
import { Navbar, Container, Button, Nav } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import Context from '../user/Context';
import logo from '../vnpost-logo1.png'

const GlobalNavbar = () => {
  const context = useContext(Context);
  const navigate = useNavigate();
  const navigateHome = () => {
    navigate('/')
  }
  const navigateDataPage = () => {
    navigate('/data-page')
  }
  const navigateLogin = () => {
    navigate('/login')
  }
  const navigateSignup = () => {
    navigate('/signup')
  }
  const logout = () => {
    context.loginUser(null)
  }
  return (
    <Navbar collapseOnSelect expand="lg" className="color-nav">
      <Container>
        <Navbar.Brand style={{ "color": "#223570" }}>
          <img
            src={logo}
            height="50"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="responsive-navbar-nav" className='justify-content-end'>
          <Nav>
            {context.user ? (<div>
              <Button className="customize-btn6"><FontAwesomeIcon icon={faUser} />{" " + context.user.username}</Button>{" "}
              <Button className="customize-btn1" onClick={navigateHome}>Home</Button>{" "}
              <Button className="customize-btn1" onClick={navigateDataPage}>Charts</Button>{" "}
              <Button className="customize-btn1" onClick={logout}>Logout</Button>
            </div>
            )
              :
              (<div style={{"justifyContent": "flex-end"}}>
                <Button className="customize-btn6"><FontAwesomeIcon icon={faUser} />{" Guest"}</Button>{" "}
                <Button className="customize-btn1" onClick={navigateHome}>Home</Button>{" "}
                <Button className="customize-btn1" onClick={navigateLogin}>Login</Button>{" "}
                <Button className="customize-btn1" onClick={navigateSignup}>Signup</Button>
              </div>)}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default GlobalNavbar;