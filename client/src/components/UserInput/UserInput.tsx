
import { IoIosSend as SendIcon } from "react-icons/io";
import { IconButton } from "@mui/joy"
import cx from 'classnames'

import "./UserInput.css";

export interface UserInputProps {
    className?: string;
    placeholder?: string;
    type?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
    value: string;
}

const UserInput = ({ className, placeholder, type, onChange, value }: UserInputProps) => {
    return (
        <div className={cx("input-container", className)}>
            <input
                className="input-field"
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            <IconButton 
                className='input-button'
                variant='outlined'
                type='submit'
            >
                <SendIcon />
            </IconButton>
        </div>
    );
};

export default UserInput;
