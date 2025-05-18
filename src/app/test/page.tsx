import React from 'react'
import CompletedScreen from '@/components/custom/completedScreen'

const TestPage = () => {
  return (
    <CompletedScreen levelName='Dead' currentXp={100} nextTierXp={400} xpIncrease={300}/>
  )
}

export default TestPage