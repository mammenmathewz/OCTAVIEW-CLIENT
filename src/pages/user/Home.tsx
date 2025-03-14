import Navbar from '../../components/user/home-login/NavBar'
import LandingPage from "../../components/user/home-login/LandingBody"

import { useRef } from 'react'

function Home() {
  const pricingRef = useRef(null);
  return (
 <>
    <Navbar  pricingRef={pricingRef}/>
    <LandingPage ref={pricingRef}/>
 </>
  )
}

export default Home