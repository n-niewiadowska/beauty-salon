import Image from "next/image";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { MainLayoutContainer } from "./components/main-layout";
import "@/app/css/main-page-styles.css";


const WelcomePage = () => {

  return (
    <MainLayoutContainer>
      <div className="main-welcome-page">
        <div className="decor-frame">
          <Image src="/images/beauty-salon.jpg" width={400} height={400} alt="Beauty Salon"/>
        </div>
        <div className="description">
          <h2>Welcome to the beauty salon!</h2>
          <p>I'm <b>Jenna Smith</b>, your dedicated stylist and the heart behind this contemporary sanctuary. 
          With four enriching years of experience, I've learned the profound importance of your satisfaction 
          and radiance.</p>
          
          <p>Step into a serene atmosphere where the rhythm of the waves meets the artistry of beauty, as we 
          craft a harmonious and uplifting experience tailored just for you.</p>

          <div className="socials">
            <a href="https://www.instagram.com"><FaInstagram size={48} /></a>
            <a href="https://www.facebook.com"><FaFacebook size={48} /></a>
            <a href="mailto:jennasmith@gmail.com"><AiOutlineMail size={48} /></a>
          </div>

          <p>Contact me on Instagram, Facebook or Gmail (linked above) if you have any questions. Sign up to 
          book an appointment and chat with me privately!</p>
          <p>! Click on the logo ! to go back to this page.</p>
        </div>
      </div>
    </MainLayoutContainer>
  );
}

export default WelcomePage;