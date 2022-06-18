import { StyledInput } from './style.js'

export const AT0002TitleArea = ({
    className,
    onFocusout
}) => {
    return (
        <StyledInput 
            type='text' 
            className={className} 
            onBlur={onFocusout} 
        />
    )
}
