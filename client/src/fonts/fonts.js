import { createGlobalStyle } from 'styled-components';
import EliceDigitalCodingRegular from './EliceDigitalCoding_Regular.woff';
import EliceDigitalCodingBold from './EliceDigitalCoding_Bold.woff';
import 다이어리 from './다이어리.woff';
import 강원도Bold from './강원도Bold.woff';
import 강원도Light from './강원도Light.woff';
import gang2 from './gang2.woff';
import 순천B from './순천B.woff';
import 순천R from './순천R.woff';

export default createGlobalStyle`		     
  @font-face {
    font-family: 'Elice Regular';	
    src: local('Elice Regular'),   
    url(${EliceDigitalCodingRegular}) format('woff');
    font-weight: 300; 
    font-style: normal;
  }
  
  @font-face {
    font-family: 'Elice Bold';	
    src: local('Elice Bold'),   
    url(${EliceDigitalCodingBold}) format('woff');
    font-weight: 300; 
    font-style: normal;
  }
  
  @font-face {
    font-family: '다이어리';	
    src: local('다이어리'),   
    url(${다이어리}) format('woff');
    font-weight: 300; 
    font-style: normal;
  }

  @font-face {
    font-family: '강원도Bold';	
    src: local('강원도Bold'),   
    url(${강원도Bold}) format('woff');
    font-weight: 300; 
    font-style: normal;
  }

  @font-face {
    font-family: 'gang2';	
    src: local('gang2'),   
    url(${gang2}) format('woff');
    font-weight: 300; 
    font-style: normal;
  }

  @font-face {
    font-family: '강원도Light';	
    src: local('강원도Light'),   
    url(${강원도Light}) format('woff');
    font-weight: 300; 
    font-style: normal;
  }

  @font-face {
    font-family: '순천B';	
    src: local('순천B'),   
    url(${순천B}) format('woff');
    font-weight: 300; 
    font-style: normal;
  }

  @font-face {
    font-family: '순천R';	
    src: local('순천R'),   
    url(${순천R}) format('woff');
    font-weight: 300; 
    font-style: normal;
  }
`;
