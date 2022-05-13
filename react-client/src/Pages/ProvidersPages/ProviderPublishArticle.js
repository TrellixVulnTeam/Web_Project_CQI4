import React, { useEffect, useState } from 'react'
import { Button, FormControl, FormSelect, FormText } from 'react-bootstrap';
import ProviderNavigationBar from '../../Components/ProvidersComponents/ProviderNavigationBar'
import { ProvidersApiRequest } from '../../RequestHeadersToWebApi';
import utf8 from 'utf8'
import ProviderMainPage from '../../ProviderMainPage';


const ARTICLE_CONTENT_MAX_LENGTH = 1800;
const ARTICLE_MAX_LENGTH_SMALL = 30;

const MAX_ARTICLES = 10;

export default function ProviderPublishArticle({ LoadArticlesFromApi }) {
  //TODO: Save written content to localstorage and display after closing
  //TODO: Edit written article
  //TODO: Add article posted prompt and clear fields

  const [showCreateTopicField, setShowCreateTopicField] = useState(false);

  const [articleTopics, setArticleTopics] = useState([""]);
  const [topicToUse, setTopicToUse] = useState("");

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const [articleEmptyError, setArticleEmptyError] = useState("");
  const [noTopicSelectedError, setNoTopicSelectedError] = useState("");
  const [titleEmptyError, setTitleEmptyError] = useState("");

  //  Used for counting how many articles has been posted without leaving the page
  const [currentPublishes, setCurrentPublishes] = useState(0);

  useEffect(() => {
    LoadTopics();
    LoadSavedContent();

    //  Reset current publishes
    setCurrentPublishes(0);
  }, [])

  async function PublishArticle(e) {
    e.preventDefault();

    let canPublish = ValidatePostArticleAndChangeErrorMessage() && IsArticleCountValid();

    if (canPublish === true) {

      console.log("publishing...")
      let parsedTopicData = JSON.parse(topicToUse);

      let articleData = {
        providerId: JSON.parse(sessionStorage.getItem("Info")).Id,
        topicId: parsedTopicData.id,
        content: utf8.encode(content),
        title: utf8.encode(title),
      }

      //  Increment current publishes count
      setCurrentPublishes((prevCurrentPublishes) => prevCurrentPublishes + 1);

      //  Publish
      ProvidersApiRequest("POST", "PostArticle", articleData);

      LoadArticlesFromApi();
    }
  }

  async function LoadTopics() {
    let response = await ProvidersApiRequest("GET", "GetAllTopics", null);
    console.log(response);
    let articleTopics = GetTopicsFromApiData(response.data.Topics)
    setArticleTopics(articleTopics);
    console.log(articleTopics)
  }


  function GetTopicsFromApiData(apiData) {
    let topics = [];
    for (let topicData of apiData) {
      //  Destructure topic object
      topics.push({
        title: topicData.topic_title,
        id: topicData.topic_id,
      });
    }
    return topics;
  }

  function IsArticleCountValid() {
    console.log(GetArticleCount())
    console.log("Current publuishes " + currentPublishes)
    return GetArticleCount() < MAX_ARTICLES && currentPublishes < MAX_ARTICLES;
  }

  function ValidatePostArticleAndChangeErrorMessage() {
    let isValid = true;//TODO: Shorten this function
    if (title === "") {
      setTitleEmptyError("חסרה כותרת")
      isValid = false;
    }
    else {
      setTitleEmptyError("")
    }
    if (content === "") {
      setArticleEmptyError("המאמר ריק מתוכן")
      isValid = false;
    }
    else {
      setArticleEmptyError("")
    }
    if (topicToUse === "") {
      setNoTopicSelectedError("לא נבחר נושא")
      isValid = false;
    }
    else {
      setNoTopicSelectedError("")
    }

    return isValid;
  }

  function ChangeSelectedTopic(event) {
    setTopicToUse(event.target.value)
    console.log(event.target.value)
  }

  function SaveContentToLocalStorage(event) {
    // localStorage.setItem("content", JSON.stringify(event.target.value));
    setContent(event.target.value)
  }

  function LoadSavedContent() {
    // setContent(JSON.parse(localStorage.getItem("content")));
  }

  function HandleNewTopicChange(event) {
    setTopicToUse(event.target.value);
  }

  function GetArticleCount() {
    let articles = JSON.parse(sessionStorage.getItem("articles"));
    return articles.length;
  }

  return (

    <ProviderMainPage>
      <div>
        {/* <ProviderNavigationBar /> */}
        <h1>כתיבת מאמר</h1>

        <form onSubmit={PublishArticle}>

          <div className="d-flex flex-column justify-content-start align-items-center" style={{ marginTop: "2%" }} >

            <div>
              <FormControl maxLength={ARTICLE_MAX_LENGTH_SMALL} type="text" placeholder="כותרת" onChange={(event) => setTitle(event.target.value)} />
              <label>{titleEmptyError}</label>
              <br />
              <textarea maxLength={ARTICLE_CONTENT_MAX_LENGTH} placeholder="תוכן" rows={10} cols={100} onChange={SaveContentToLocalStorage} />
              <br />
              <label>{articleEmptyError}</label>
            </div>

            <div>

              <br />
              <FormSelect onChange={ChangeSelectedTopic} style={{ width: "200px", opacity: showCreateTopicField ? "60%" : "100%" }} disabled={showCreateTopicField}>
                <option hidden={true}>בחירת נושא</option>
                {
                  articleTopics.map((topic, index) => {
                    return (
                      <option key={index} value={JSON.stringify(topic)} >{topic.title}</option>
                    )
                  })
                }
              </FormSelect>
              <br />


              {
                showCreateTopicField === true
                  ?
                  <div>
                    <FormControl maxLength={ARTICLE_MAX_LENGTH_SMALL} type="text" placeholder="נושא" name="topicFormField" onChange={HandleNewTopicChange} />
                    <br />
                    <Button onClick={() => setShowCreateTopicField(false)}>בחירת נושא</Button>
                  </div>
                  :
                  <div>
                    <Button onClick={() => setShowCreateTopicField(true)}>יצירת נושא</Button>
                  </div>
              }
            </div>


            <br />

            <label>{noTopicSelectedError}</label>
            <input type="submit" value="פרסום מאמר" />
          </div>
        </form>

      </div>
    </ProviderMainPage >
  )
}
