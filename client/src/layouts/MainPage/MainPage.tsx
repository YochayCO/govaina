import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'

import './MainPage.css'
import ActionsSet from '../../components/ActionButton/ActionsSet'
import { UserAction } from '../../types/users'

const TUTORIAL_TEXT_1 = `היי, אני עוזר ה-AI של המרכז להעצמת האזרח, לבחינת עבודת הממשלה. אז מה אני יודע לעשות? כרגע להעריך את מידת הישימות של החלטות ממשלה. רוצה לנסות?\n
על מנת להתחיל תבחרו `

const TUTORIAL_TEXT_2 = ` והדביקו כאן מספר החלטת ממשלה ואת נוסח ההחלטה`

const tutorialElement = (
  <div className="tutorial">
    {TUTORIAL_TEXT_1}
    <a
      target="_blank"
      href="https://www.gov.il/he/departments/dynamiccollectors/gov_decision"
    >
      החלטת ממשלה
    </a>
    {TUTORIAL_TEXT_2}
  </div>
)
function MainPage() {
  const [selectedAction, selectAction] = useState<UserAction | null>(null)

  const { pathname } = useLocation()

  return (
    <div className="main-page">
      <div className="logo-section">
        <img src="/CECI-wide-logo.png" alt="CECI logo" />
      </div>
      <div className="content">
        {pathname == '/' && (
          <>
            {tutorialElement}
            <ActionsSet
              actions={[
                'decisionNumber',
                'showExampleByLink',
                'chatAboutDecision',
                'showExample',
                'showExampleByInterest',
              ]}
              selectedAction={selectedAction}
              selectAction={selectAction}
            />
          </>
        )}

        <Outlet context={{ selectedAction }} />
      </div>
    </div>
  )
}

export default MainPage
