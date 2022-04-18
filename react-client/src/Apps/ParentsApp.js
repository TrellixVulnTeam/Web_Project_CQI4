//	#region Imports

//  CSS
import '../BackgroundImages/ParentsStyles.css'

//	Hooks
import React from 'react';
import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

//	Main pages 
import WelcomePage from '../Pages/GeneralPages/WelcomePage'
import About from '../Pages/GeneralPages/About';
import ParentRegister from '../Pages/ParentsPages/ParentRegister';
import ParentLogin from '../Pages/ParentsPages/ParentLogin';
import EditProfilePage from '../Pages/ParentsPages/EditProfilePage';
import GamesPage from '../Pages/ParentsPages/GamesPage'
import InfoPage from '../Pages/ParentsPages/InfoPage';
import AvatarPage from '../Pages/ParentsPages/AvatarPage';
import JournalPage from '../Pages/ParentsPages/JournalPage';
import HomePage from '../Pages/ParentsPages/HomePage';

//  Components
import { PublicRoute } from '../Components/GeneralComponents/PublicRoute'

//	Bootstrap css import
import 'bootstrap/dist/css/bootstrap.min.css';




//	Contexts
import { NavBarContext } from '../Contexts/NavBarContext';

//  Helper classes
import PageDoesntExist from '../PageDoesntExist';
import { ParentsApiRequest } from '../RequestHeadersToWebApi';
import ProtectedRoute from '../Components/GeneralComponents/ProtectedRoute';

import utf8 from 'utf8';
// import GameRoutes from '../Games/GameRoutes';
import { GameRoutes } from '../Pages/ParentsPages/GamesPage';

//	#endregion

/**
 * normal comment
 * *Important highlighted
 * ! Warning
 * ? Query
 * TODO: todo comment
 * @param myParameter The parameter for something
 */


/** */


// * React app component
export default function ParentsApp() {

  const [currentChild, setCurrentChild] = useState({});
  const [username, setUsername] = useState('no username');

  const [userExists, setUserExists] = useState(null);

  let history = useHistory();

  /**Gets the children belonging to the logged parent
   * Set current children profiles to the matching children
   */
  async function LoadChildrenFromServer() {

    let parentId = JSON.parse(sessionStorage.getItem('userId'));

    console.log(parentId);
    if (parentId) {
      let res = await ParentsApiRequest('GET', 'GetChildren', { parentId: parentId }).catch(err => console.log(err))

      //  Set children
      sessionStorage.setItem('children', JSON.stringify(res.data));
      let children = JSON.parse(sessionStorage.getItem('children'));

      //  Set current child
      if (children.length === 0) {
        sessionStorage.setItem('currentChild', 'null');
        console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')
        setCurrentChild(null);
      }
      else {
        sessionStorage.setItem('currentChild', JSON.stringify(GetSelectedChild(children)))
        setCurrentChild(JSON.parse(sessionStorage.getItem('currentChild')));
      }

    }
  }


  useEffect(() => {
    console.log(history.location.pathname);
  })


  function GetSelectedChild(childrenArray) {
    let tempArray = [...childrenArray];
    let child = undefined;

    tempArray.forEach((tempChild) => {
      console.log(child);
      console.log(tempArray);
      if (tempChild.IsSelected) {
        child = tempChild;
      }
    });
    console.log(childrenArray);

    return child;
  }

  function HandleLoginResponse(response) {
    //  Clear previous data
    sessionStorage.clear();

    //	Set sessionStorage items and states
    sessionStorage.setItem("token", response.data.token);
    sessionStorage.setItem('userType', JSON.stringify("Parent"));



    sessionStorage.setItem("userId", response.data.FromParent.ParentInfo.Id);
    sessionStorage.setItem("username", response.data.FromParent.ParentInfo.Username);
    setUsername(sessionStorage.getItem("username"));

    //  Load children
    LoadChildrenFromServer();

    //	Redirect to welcome page
    history.push("/Parent/Welcome");
  }


  async function HandleParentLogin(e, formValid) {

    e.preventDefault();

    if (formValid) {
      let loginData = {
        email: e.target.loginEmailField.value,
        password: e.target.loginPasswordField.value,
      }

      try {

        // let loginResponse = await RequestLoginAsParent(email, password);
        let loginResponse = await ParentsApiRequest('POST', 'ParentLogin', loginData);
        console.log(loginResponse);

        if (loginResponse.data.FromParent.UserExists === true) {
          HandleLoginResponse(loginResponse);
        }
        else {
          setUserExists(true);
          //alert("user not found");
        }
      }
      catch (err) {
        console.log(err);
      }

    }
  }

  async function HandleParentRegister(e, formValid) {
    e.preventDefault();

    if (formValid) {

      let userData = {
        username: utf8.encode(e.target.registerUsernameField.value),
        email: e.target.registerEmailField.value,
        password: e.target.registerPasswordField.value,
        confirmPassword: e.target.registerPasswordConfirmField.value,
      };
      //!	Note, i'm sending the confirm password too

      let response = await ParentsApiRequest('POST', 'ParentRegister', userData).catch(err => console.log(err));
      if (response) {
        console.log(response);
        if (response.data.Registered === true) {

          let loginResponse = await ParentsApiRequest('POST', 'ParentLogin', userData);
          console.log(loginResponse)

          HandleLoginResponse(loginResponse);

        }
        else if (response.data.UserExists) {
          alert("User already exists");
          // setUserExists(true);
        }
        else {
          console.error("ERROR IN REGISTER USER");
        }
      }
    }
  }


  useEffect(() => {
    //	Load username and current child
    setUsername(sessionStorage.getItem('username'));
    setCurrentChild(JSON.parse(sessionStorage.getItem('currentChild')));

    LoadChildrenFromServer();
  }, [])


  return (

    <div className="parent-background-image">

      {/* LOGIN */}
      <PublicRoute exact path="/" component={() =>
        <ParentLogin
          HandleLogin={(e, isValid) => HandleParentLogin(e, isValid)}
          UserExists={userExists}
        />} />


      {/* REGISTER */}
      <PublicRoute exact path="/Parent/Register" component={() =>
        <ParentRegister
          HandleRegister={(e, isValid) => HandleParentRegister(e, isValid)}
          UserExists={userExists}
        />} />

      <NavBarContext.Provider value={{
        child: currentChild,
        username: username,
      }}>

        <ProtectedRoute exact path="/Parent/Welcome" Component={WelcomePage} />

        {/* ABOUT */}
        <ProtectedRoute exact path="/Parent/About" Component={About} />

        {/* EDIT PROFILE */}
        <ProtectedRoute exact path="/Parent/EditProfile" Component={() =>
          <EditProfilePage
            LoadChildrenFromServer={LoadChildrenFromServer}
          />}
        />

        {/* GAMES */}
        <ProtectedRoute exact path="/Parent/Games" Component={() =>
          <GamesPage
          />}
        />


        <ProtectedRoute exact path="/Parent/Info" Component={InfoPage} />

        <ProtectedRoute exact path="/Parent/Avatar" Component={AvatarPage} />

        {/* JOURNAL */}
        <ProtectedRoute exact path="/Parent/Journal" Component={() =>
          <JournalPage
            LoadChildrenFromServer={LoadChildrenFromServer}
          />} />

        <ProtectedRoute exact path="/Parent/Home" Component={HomePage} />


        <GameRoutes UpdateChildrenProfiles={LoadChildrenFromServer} />

      </NavBarContext.Provider>
    </div>
  );
}