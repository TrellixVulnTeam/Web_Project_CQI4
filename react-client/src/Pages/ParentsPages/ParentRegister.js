import '../../CSS/pages-css/Register.css'
import { Link } from "react-router-dom"
import { ValidateUsername, ValidateEmail, ValidatePassword, ValidateConfirmPassword } from '../../Project-Modules/ValidateUserInput'
import { useState } from 'react'
import FormInputField from '../../Components/GeneralComponents/FormInputField'

export default function ParentRegister({ HandleRegister }) {

  let usernameValid = true;
  let emailValid = true;
  let passwordValid = true;
  let confirmPasswordValid = true;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameValidState, setUsernameValidState] = useState(true);
  const [emailValidState, setEmailValidState] = useState(true);
  const [passwordValidState, setPasswordValidState] = useState(true);
  const [confirmPasswordValidState, setConfirmPasswordValidState] = useState(true);

  function OnSubmit(e) {
    e.preventDefault();

    //  Check every input
    usernameValid = ValidateUsername(username);
    emailValid = ValidateEmail(email);
    passwordValid = ValidatePassword(password);
    confirmPasswordValid = ValidateConfirmPassword(confirmPassword, password);

    setUsernameValidState(usernameValid)
    setEmailValidState(emailValid)
    setPasswordValidState(passwordValid)
    setConfirmPasswordValidState(confirmPasswordValid)

    HandleRegister(e, usernameValid && emailValid && passwordValid && confirmPasswordValid)
  }

  const onChangeHandler = (fieldName, value) => {
    if (fieldName === "username") {
      setUsername(value);
    }
    else if (fieldName === "email") {
      setEmail(value);
    }
    else if (fieldName === "password") {
      setPassword(value);
    }
    else if (fieldName === "confirmPassword") {
      setConfirmPassword(value);
    }
  }


  return (
    <div>

      <div className="RegisterContainer">
        <h1>הרשמת הורים</h1>
        <Link to="/" >התחברות הורים</Link>

        <form onSubmit={OnSubmit}>
          <div className="InputContainer">

            <label>שם משתמש:</label>
            <FormInputField Valid={usernameValidState} Name={"registerUsernameField"} OnChange={(e) => { onChangeHandler("username", e.target.value) }} />

            <label>אי-מייל:</label>
            <FormInputField Valid={emailValidState} Name={"registerEmailField"} OnChange={(e) => { onChangeHandler("email", e.target.value) }} />

            <label>סיסמה:</label>
            <FormInputField Valid={passwordValidState} Name={"registerPasswordField"} OnChange={(e) => { onChangeHandler("password", e.target.value) }} />

            <label>אשר סיסמה:</label>
            <FormInputField Valid={confirmPasswordValidState} Name={"registerPasswordConfirmField"} OnChange={(e) => { onChangeHandler("confirmPassword", e.target.value) }} />

            <input type="submit" value="הירשם" />
          </div>
        </form>

      </div>
    </div >
  )
}