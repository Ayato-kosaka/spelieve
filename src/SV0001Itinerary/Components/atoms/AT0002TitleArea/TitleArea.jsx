import { Styled_input } from './style.js'

export const AT0002TitleArea = ({
    className,
    onFocusout
}) => {
    return (
        <Styled_input 
            type='text' 
            className={className} 
            onBlur={onFocusout} 
        />
    )
}
