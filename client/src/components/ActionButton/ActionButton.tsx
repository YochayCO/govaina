import cx from 'classnames'
import Button, { ButtonProps } from '@mui/joy/Button'

import './ActionButton.css'

interface ActionButtonProps extends ButtonProps {
  active?: boolean;
}
function ActionButton({ className, active, ...rest }: ActionButtonProps) {

  return (
    <Button
      className={cx('action-button', className)} 
      variant={ active ? 'solid' : 'outlined'} 
      color='primary' 
      size='sm' 
      {...rest}
    />
  )
}

export default ActionButton
