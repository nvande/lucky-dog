import HeaderComponent from './HeaderComponent.js';
import FooterComponent from './FooterComponent.js';

const footer = "This website is for demonstration purposes only.";
const attributes = "Dog images provided by Chatra Ardhisuryo on Vecteezy.com and additional images by Rawpixel.com."

function PageComponent(props) {
  return (
    <div>
        <HeaderComponent/>
        <div className={'container ldBody mt-sm-5'}>
          {props.children}
        <FooterComponent footer={footer} attributes={attributes}/>
        </div>
    </div>
  );
}

export default PageComponent;