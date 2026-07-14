import React from 'react'
import Hero from '../components/Hero'
import Highlights from '../components/Highlights'
import FeaturedProduts from '../components/FeaturedProduts'

function Home() {
  return (
    <div>
        <Hero />
        <div className="p-8">
        <Highlights />
        <FeaturedProduts />
        </div>

    </div>
  )
}

export default Home