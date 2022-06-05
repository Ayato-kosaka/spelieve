import { useTranslation } from 'react-i18next';
import { StyledContainer, StyledLink } from './style.js';

import Typography from '@material-ui/core/Typography';
import GitHubIcon from '@material-ui/icons/GitHub';



const MC0004Footer = () => {
    const { t } = useTranslation();
    const Copyright = (props) => {
        return (
            <Typography variant='body2' align='center' {...props}>
                {'Copyright © '}
                <StyledLink color='inherit' href='/'>
                    {t('PROJECT.NAME')}
                </StyledLink>
                {' ' + (new Date().getFullYear()) + '.'}
            </Typography>
        );
    }
    const footers = [{
            title: t('しおり新規作成'),
            link: '/'
        },
        {
            title: t('お問い合わせ'),
            link: 'https://docs.google.com/forms/d/e/1FAIpQLSc0f-CYZAb6kBsWlMZ_5W4c0CMipNSbo-zEivUMa_jrMy4UFA/viewform?usp=sf_link'
        },
        {
            title: t('フィードバック'),
            link: 'https://docs.google.com/forms/d/e/1FAIpQLSc5tuLbjx5CZX2pBr3wz9rcpdX710y6Ov2wVu2LObhIwFD5vQ/viewform?usp=sf_link'
        },
    ];
    const color = '#fff'
    return (
        <StyledContainer
            maxWidth='md'
            component='footer'
            sx={{
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                py: [3, 6],
            }}
        >
            {footers.map((footer) => (
                <Typography 
                    key={footer.title} 
                    variant='h6' 
                    gutterBottom
                    style={{'textAlign': 'center'}}
                >
                    <StyledLink 
                        href={footer.link} 
                        target='_blank'
                        rel='noopener noreferrer'
                        variant='subtitle1' 
                        color={color}
                    >
                        {footer.title}
                    </StyledLink>
                </Typography>
            ))}
            <Typography 
                variant='h6' 
                gutterBottom
                style={{'textAlign': 'center'}}
                sx={{ mt: 3 }}
            >
                <StyledLink 
                    href='https://github.com/Ayato-kosaka/react-itinerary' 
                    target='_blank'
                    rel='noopener noreferrer'
                    variant='subtitle1' 
                    color={color}
                >
                    <GitHubIcon />
                </StyledLink>
            </Typography>
            <Copyright sx={{ mt: 3 }} color={color} />
        </StyledContainer>
    );
}

export default MC0004Footer;
