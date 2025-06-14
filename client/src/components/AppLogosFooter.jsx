import React from 'react';
import AppLogo1 from '../assets/AppLogos/app1.png';
import AppLogo2 from '../assets/AppLogos/app2.png';
import AppLogo3 from '../assets/AppLogos/app3.png';
import AppLogo4 from '../assets/AppLogos/app4.png';
import AppLogo5 from '../assets/AppLogos/app5.png';
import AppLogo6 from '../assets/AppLogos/app6.png';
import AppLogo7 from '../assets/AppLogos/app7.png';

const AppLogosFooter = () => {
    return (
        <footer className='app-logos'>
            <a href="https://apps.microsoft.com/detail/9wzdncrdsnzk?hl=en-US&gl=US" target="_blank" rel="noopener noreferrer"><img src={AppLogo1} alt="App Logo 1" /></a>
            <a href="https://apps.microsoft.com/detail/9nblggh318dq?hl=en-US&gl=US" target="_blank" rel="noopener noreferrer"><img src={AppLogo2} alt="App Logo 2" /></a>
            <a href="https://apps.microsoft.com/detail/9nblggh3tktw?hl=en-US&gl=US" target="_blank" rel="noopener noreferrer"><img src={AppLogo3} alt="App Logo 3" /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><img src={AppLogo4} alt="App Logo 4" /></a>
            <a href="https://apps.microsoft.com/detail/9pmzc1nvwk02?hl=en-US&gl=US" target="_blank" rel="noopener noreferrer"><img src={AppLogo5} alt="App Logo 5" /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><img src={AppLogo6} alt="App Logo 6" /></a>
            <a href="https://apps.microsoft.com/detail/9nblggh2kbbk?hl=en-US&gl=US" target="_blank" rel="noopener noreferrer"><img src={AppLogo7} alt="App Logo 7" /></a>
        </footer>
    );
};

export default AppLogosFooter;
