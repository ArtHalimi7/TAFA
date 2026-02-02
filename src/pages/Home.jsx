import React from 'react'
import Hero from '../components/Hero'
import FeaturedCollection from '../components/FeaturedCollection'
import TheStandard from '../components/TheStandard'
import WhyCurated from '../components/WhyCurated'
import Footer from '../components/Footer'
import { useSEO, seoContent } from '../hooks/useSEO'

const Home = () => {
  // SEO optimization for homepage
  useSEO(seoContent.home);

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