import { Navbar, Container, Nav, NavDropdown, NavItem } from 'react-bootstrap'
import { Link } from "react-router-dom"


//  היומן שלי, שינוי אווטר, עריכת פרופיל, משחקייה, מאמרים, אודותר

//  The main pages are: Games, info, about, edit profile, avatar, journal

function NavigationBar() {
  return (
    <div dir="rtl">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container fluid className="h-25">
          <Navbar.Brand href="/Home">כפתור בית</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Link to="/Games" className="nav-link">משחקייה</Link>
              <Link to="/Info" className="nav-link">מאמרים</Link>
              <Link to="/About" className="nav-link">אודות</Link>
              <Link to="/EditProfile" className="nav-link">עריכת פרופיל</Link>
              <Link to="/Avatar" className="nav-link">שינוי אווטר</Link>
              <Link to="/Journal" className="nav-link">היומן שלי</Link>
              {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">דברים</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">עוד דברים</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">עוד דברים</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default NavigationBar



// <Nav.Link href="#home">משחקייה</Nav.Link>
//             <Nav.Link href="#features">פניות</Nav.Link>
//             <Nav.Link href="#pricing">מאמרים</Nav.Link>
//             <Nav.Link href="#pricing">אודות</Nav.Link>
//             <Nav.Link href="#pricing">עריכת פרופיל</Nav.Link>
//             <Nav.Link href="#pricing">שינוי אווטר</Nav.Link>
//             <Nav.Link href="#pricing">היומן שלי</Nav.Link>