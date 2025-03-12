import { useState } from 'react'
import DotLoader from 'react-spinners/DotLoader'
import { Input, Textarea } from '@mui/joy'

import { evaluate } from '../../api/backend/evaluations'
import EvaluationSection from '../../components/EvaluationSection/EvaluationSection'

import './MainPage.css'

function MainPage() {
  const [decisionNumber, setDecisionNumber] = useState<number>(0)
  const [decisionText, setDecisionText] = useState<string>('')
  const [analyzationResult, setEvaluationResult] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleDecisionNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDecisionNumber(parseInt(event.target.value))
  }
  const handleDecisionTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDecisionText(event.target.value)
  }

  const sendToEvaluation = async () => {
    setIsLoading(true)

    const [err2, responseText] = await evaluate(decisionNumber, decisionText)
    
    if (err2) {
      setError(err2.toString())
    } else {
      setEvaluationResult(responseText)
    }
    setIsLoading(false)
  }

  return (
    <div className='main-page'>
      <div className='logo-section'>
        <img src="/CECI-wide-logo.png" alt="CECI logo" />
      </div>
      <div className='tutorial'>
        {`היי, אני עוזר ה-AI של המרכז להעצמת האזרח, לבחינת עבודת הממשלה. אז מה אני יודע לעשות? כרגע להעריך את מידת הישימות של החלטות ממשלה. רוצה לנסות?\n
על מנת להתחיל תבחרו `}
        <a target='_blank' href='https://www.gov.il/he/departments/dynamiccollectors/gov_decision'>החלטת ממשלה</a>
        {` והדביקו כאן מספר החלטת ממשלה ואת נוסח ההחלטה`}
      </div>
      <div className="inputs-form">
        <label>מספר ההחלטה</label>
        <Input className='decision-number-input' type='number' onChange={handleDecisionNumberChange} />
        <label>תוכן ההחלטה</label>
        <Textarea
          className='decision-text-input'
          value={decisionText}
          onChange={handleDecisionTextChange} 
          placeholder="הדביקו כאן את תוכן ההחלטה"
          minRows={4}
        />
        <button className='evaluate-button' onClick={sendToEvaluation}>Evaluate</button>
      </div>
      {isLoading && <div className='loader-container'><DotLoader className='loader' /></div>}
      {(!isLoading && analyzationResult) && <EvaluationSection text={analyzationResult} />}
      {(!isLoading && error) && <>
        <p>משהו לא הצליח. אם יש צורך, צור קשר עם התמיכה ושלח את השגיאה שקיבלת.</p>
        <code className='error-message'>{error}</code>
      </>}
    </div>
  )
}

export default MainPage
