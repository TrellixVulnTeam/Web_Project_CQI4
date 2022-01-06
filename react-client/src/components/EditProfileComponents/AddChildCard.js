import { Card } from "react-bootstrap"
import AddChildForm from "./AddChildForm"

function AddChildCard({ HandleAddChild }) {
  return (
    <div>
      <Card
        bg={"white"}
        key={1}
        border={"dark"}
        text={"dark" /*Can be light or dark*/}
        style={{ width: '30rem' }}
        className="mb-3"
      >
        <Card.Header>הוספת ילד/ה</Card.Header>
        <Card.Body>
          <Card.Text as="div">
            <AddChildForm HandleAddChild={(e) => HandleAddChild(e)} />
          </Card.Text>
        </Card.Body>
      </Card>

    </div>
  )
}

export default AddChildCard
