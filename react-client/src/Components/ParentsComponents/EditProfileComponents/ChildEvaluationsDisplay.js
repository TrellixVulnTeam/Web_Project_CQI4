export default function ChildEvaluationsDisplay({ Evaluations }) {

  //  Evaluations consists of Topic and score

  return (
    <div>
      {
        // If child has evaluations
        Evaluations.length > 0 ?

          // Map each one to its corresponding name
          Evaluations.map((evaluation, index) => {
            return (
              <div key={index}>
                {evaluation.GameName} : {evaluation.Score}
              </div>

            )
          })

          : // Else
          <label>אין נתונים</label>
      }

    </div>
  );
}
