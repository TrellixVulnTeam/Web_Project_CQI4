import { Modal, Button } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import { ParentsApiRequest, ProvidersApiRequest } from "../../../RequestHeadersToWebApi"

import './ArticleModalStyles.css'


export default function ArticleModal({ SetGamesSearchValue, ShowArticleModal, CloseArticleModal, TopicTitle, TopicId, Title, ProviderName, Content, ProviderPhone, ProviderEmail, ProviderOccupation }) {

  // function ProviderPhoneEmailFormat() {

  //   // {phone}/{email}
  //   if (phone === "" || email === "") {

  //   }
  // }

  return (
    <div>
      <Modal show={ShowArticleModal} className="article-modal-main" centered dialogClassName="modal-dialog">
        <Modal.Body className="article-modal-body" >
          <div className="article-modal-content-top">
            <Modal.Title>{Title}</Modal.Title>

            {Content}
            <div className="article-modal-content-body">
            </div>
          </div>

          <div className="article-modal-content-bottom">
            <label>
              כותב המאמר: {ProviderName}
            </label>
            <label>
              {/* Display a "/" if there is a phone number and an email address */}
              צור קשר: {ProviderPhone}{(ProviderPhone !== null && ProviderEmail !== null) ? " / " : " "}{ProviderEmail}
            </label>
            <label>
              תעסוקה: {ProviderOccupation}
            </label>
          </div>

        </Modal.Body>
        <Modal.Footer className="article-modal-footer">
          <div>
            <label>תחום: {TopicTitle}</label>
          </div>


          <div>
            <ShowGamesByTopicButton SetGamesSearchValue={SetGamesSearchValue} TopicTitle={TopicTitle} />
            <Button variant="danger" onClick={() => CloseArticleModal()}>סגירה</Button>
          </div>

        </Modal.Footer>
      </Modal>
    </div>
  )
}



function ShowGamesByTopicButton({ TopicTitle, SetGamesSearchValue }) {
  const history = useHistory();

  //  TODO: Change function name
  function Yee(topicTitle) {
    history.push('/Parent/Games');
    sessionStorage.setItem('gamesSearchValue', topicTitle);

    SetGamesSearchValue(topicTitle);
  }

  return (
    <Button onClick={() => Yee(TopicTitle)}>למשחקים בתחום</Button>
  )
}
