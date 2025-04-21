import { IconButton } from '@mui/joy'
import cx from 'classnames'
import { Send } from '@mui/icons-material'

import './UserInput.css'

export interface UserInputProps {
  className?: string
  placeholder?: string
  type?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  value: string
}

const UserInput = ({
  className,
  placeholder,
  type,
  onChange,
  value,
}: UserInputProps) => {
  const numOfLines = value.split('\n').length <= 4 ? value.split('\n').length : 5

  return (
    <div className={cx('input-container', className)}>
      {type === 'textarea' ? (
        <textarea
          className="input-field"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={numOfLines}
        />
      ) : (
        <input
          className="input-field"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
      <IconButton className="input-button" variant="outlined" type="submit">
        <Send sx={{ transform: 'rotate(180deg)' }} />
      </IconButton>
    </div>
  )
}

export default UserInput
