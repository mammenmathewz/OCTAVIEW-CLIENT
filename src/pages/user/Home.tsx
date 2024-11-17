import{Link} from 'react-router-dom'
import Navbar from '../../components/user/home-login/NavBar'
import { Button } from "../../components/ui/button"

function Home() {
  return (
 <>
    <div className="text-red-600 ">
    <ul className="gap-7  flex justify-end p-3">
    
    <li>Docs</li>
    </ul>
    </div>
    <Navbar/>
    <Button className='mt-16 ml-24'  variant="destructive">Click me</Button>
 </>
  )
}

export default Home