import { useTranslation } from 'react-i18next';
import { StyledTypography } from './style.js';


export const AT0006TimeP = ({
    value,
    hourUnit = ':',
    minUnit = '',
    ...props
}) => {
    const { t } = useTranslation();
    const display = () => {
        let [hour, min] = [value && value.getHours(), value && value.getMinutes()].map((x) => (String(x).padStart((!minUnit) ? 2 : 1, '0')));
        if (parseInt(hour)!=0 || !minUnit) {
            return (hour + hourUnit + (parseInt(min)!=0 || !minUnit ? min : ''));
        } else {
            return (min + minUnit);
        }
    }
    return (
        <>
            <StyledTypography
                variant="body1"
                { ...props }
            >
                { display() }
            </StyledTypography>
        </>
    );
};
export default AT0006TimeP;