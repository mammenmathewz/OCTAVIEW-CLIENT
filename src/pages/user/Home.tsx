import{Link} from 'react-router-dom'
import Navbar from '../../components/user/home-login/NavBar'
import { Button } from "../../components/ui/button"
import LandingPage from "../../components/user/home-login/LandingBody"

function Home() {
  return (
 <>
    <Navbar/>
    <LandingPage/>
 </>
  )
}

export default Home