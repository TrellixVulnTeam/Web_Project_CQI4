import MemoryGame from "../../Games/MemoryGame/MemoryGame";
import ParentMainPage from "../../Components/ParentsComponents/ParentMainPage"
import GamePreviewCard from "../../Components/GeneralComponents/GamesComponents/GamePreviewCard";
import Img from '../../images/download.jpg'
import GamePreviewCardsGrid from "../../Components/GeneralComponents/GamesComponents/GamePreviewCardsGrid";
import { useState } from "react";
import axios from "axios";
import GameTemplate from "../../Games/GameTemplate";
import { ParentsApiRequest } from "../../RequestHeadersToWebApi";
import MatchCardsGame from "../../Games/MatchCardsGame/MatchCardsGame";
import NoChildrenMessage from "../../Components/ParentsComponents/GamesPageComponents/NoChildrenMessage";

const GAMES_MENU_ID = -1;

export default function GamesPage({ LoadChildrenFromServer: UpdateChildrenProfiles }) {

  const [currentGameId, setCurrentGameId] = useState(GAMES_MENU_ID);

  function ExitGame() {
    setCurrentGameId(GAMES_MENU_ID);
  }

  function EndGame(score, gameId) {
    alert("Game score: " + score);

    let evaluationScoreData = {
      childId: JSON.parse(sessionStorage.getItem('currentChild')).Id,
      gameId: gameId,
      gameScore: score,
    }

    ParentsApiRequest('POST', 'UpdateEvaluationScore', evaluationScoreData)
      .catch(err => console.log(err))
      .then(() => {
        setCurrentGameId(GAMES_MENU_ID);
        UpdateChildrenProfiles();
      })
  }


  //Mock data
  const GAMES = [
    {
      name: "משחק הזיכרון",
      description: "תיאור משחק זיכרון",
      id: 1,
      gameComponent: <GameTemplate ExitGame={ExitGame} EndGame={EndGame} GameId={4} GameComponent={MemoryGame} />
    },
    {
      name: "התאמת קלפים",
      description: "תיאור התאמת קלפים",
      id: 2,
      gameComponent: <GameTemplate ExitGame={ExitGame} EndGame={EndGame} GameId={8} GameComponent={MatchCardsGame} />

    },
    {
      name: "פאזל",
      description: "תיאור פאזל",
      id: 3,
    },
  ];


  function HandlePlay(gameId) {
    //  Play the game by the given id
    //  the ids come from the db

    setCurrentGameId(gameId);
    console.log(gameId);
  }



  function RenderCurrentGame() {
    let gameToRender = <div>Hello!</div>
    GAMES.forEach(game => {
      if (game.id === currentGameId) {
        gameToRender = game.gameComponent;
      }
    })

    return gameToRender;
  }

  function DoesUserHaveChildren() {
    let children = JSON.parse(sessionStorage.getItem('children'));
    let hasChildren = false;

    console.log(children);
    if (children && children.length > 0) {
      hasChildren = true;
    }

    return hasChildren;
  }

  return (
    <div>
      <ParentMainPage>

        <h1>משחקים</h1>

        {
          DoesUserHaveChildren() ?
            currentGameId === GAMES_MENU_ID ?
              <GamePreviewCardsGrid HandlePlay={HandlePlay} Games={GAMES} />
              :
              RenderCurrentGame()
            :

            <NoChildrenMessage />
        }

      </ParentMainPage>
    </div>
  )
}