import { useNavigate } from 'react-router'

import './ActionsSet.css'
import ActionButton from './ActionButton'
import { UserAction } from '../../types/users'

export type ActionsSetProps = {
  actions: UserAction[]
  selectedAction: UserAction | null
  selectAction: (action: UserAction | null) => void
}

const ACTION_LABELS_DICT: Record<UserAction, string> = {
  decisionNumber: 'יש לי מספר החלטה',
  showExampleByLink: 'יש לי קישור להחלטה',
  chatAboutDecision: 'יש לי שאלה על החלטה',
  showExample: 'תן לי דוגמא',
  showExampleByInterest: 'דוגמאות לפי תחום עניין',
}

const DISABLED_ACTIONS: UserAction[] = [
  'showExampleByLink',
  'chatAboutDecision',
]

function ActionsSet({
  actions,
  selectedAction,
  selectAction,
}: ActionsSetProps) {
  const navigate = useNavigate()

  return (
    <div className="actions-set">
      {actions.map((action) => (
        <ActionButton
          key={action}
          active={action === selectedAction}
          onClick={() => {
            selectAction(action)
            navigate('chat')
          }}
          disabled={DISABLED_ACTIONS.includes(action)}
        >
          {ACTION_LABELS_DICT[action]}
        </ActionButton>
      ))}
    </div>
  )
}

export default ActionsSet
