import React from 'react'
import CompletedScreen from '@/components/custom/completedScreen'

const TestPage = () => {
  return (
    <CompletedScreen currentXp={1002} nextTierXp={400} xpIncrease={30}/>
  )
}

export default TestPage