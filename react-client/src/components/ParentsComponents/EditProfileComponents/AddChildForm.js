import { useState } from "react";
import { ValidateUserInput_Heb } from "../../../Project-Modules/ValidateUserInput";
import FormInputField from "../../GeneralComponents/FormInputField";

function AddChildForm({ HandleAddChild }) {
  let childNameValid = true;
  const [childName, setChildName] = useState("");
  const [childNameValidState, setChildNameValidState] = useState(true);

  const OnSubmit = (e) => {
    e.preventDefault();

    childNameValid = ValidateUserInput_Heb(childName);
    setChildNameValidState(childNameValid);
    console.log(childNameValid)

    HandleAddChild(e, childNameValid)
  }


  return (
    <div>
      <form onSubmit={OnSubmit} >

        <div className="InputContainer">
          {/* TODO: Add name validation */}
          <label>שם:</label>

          <FormInputField Valid={childNameValidState} Name={"childNameField"} OnChange={(e) => setChildName(e.target.value)} />

          <label>גיל:</label>
          <select name="childAgeSelect">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>

          <input type="submit" value="הוספה" />
        </div>
      </form>
    </div>
  )
}

export default AddChildForm