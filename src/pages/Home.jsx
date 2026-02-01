import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturedCollection from '../components/FeaturedCollection'
import TheStandard from '../components/TheStandard'

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedCollection />
      <TheStandard />
    </>
  )
}

export default Home