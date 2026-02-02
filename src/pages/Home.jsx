import React from 'react'
import Hero from '../components/Hero'
import FeaturedCollection from '../components/FeaturedCollection'
import TheStandard from '../components/TheStandard'
import WhyCurated from '../components/WhyCurated'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedCollection />
      <WhyCurated />
      <TheStandard />
      <Footer />
    </>
  )
}

export default Home