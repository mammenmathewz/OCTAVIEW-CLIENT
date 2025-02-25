import{Link} from 'react-router-dom'
import Navbar from '../../components/user/home-login/NavBar'
import { Button } from "../../components/ui/button"
import LandingPage from "../../components/user/home-login/LandingBody"

function Home() {
  return (
 <>
    <div>
    <ul className="gap-7  flex justify-end p-3">
    
    <li>Docs</li>
    </ul>
    </div>
    <Navbar/>
    <LandingPage/>
 </>
  )
}

export default Home