import { IconButton } from '@mui/joy'
import cx from 'classnames'
import { Send } from '@mui/icons-material'

import './UserInput.css'

export interface UserInputProps {
  className?: string
  placeholder?: string
  type?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit?: (event?: React.FormEvent<HTMLFormElement>) => void
  value: string
  disabled?: boolean
}

const UserInput = ({
  className,
  placeholder,
  type,
  onChange,
  onSubmit,
  value,
  disabled,
}: UserInputProps) => {
  const numOfLines = value.split('\n').length <= 4 ? value.split('\n').length : 5
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      
      if (onSubmit) {
        onSubmit()
      }
    }
  }

  return (
    <div className={cx('input-container', className)}>
      {type === 'textarea' ? (
        <textarea
          className="input-field"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          rows={numOfLines}
          disabled={disabled}
        />
      ) : (
        <input
          className="input-field"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      )}
      <IconButton className="input-button" variant="outlined" type="submit">
        <Send sx={{ transform: 'rotate(180deg)' }} />
      </IconButton>
    </div>
  )
}

export default UserInput
