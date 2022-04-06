import React from 'react'
import styles from './SampleBuggyButton.module.css'

export const SampleBuggyButton = ({children}: React.PropsWithChildren<{}>) => {
  const [isError, setError] = React.useState(false);
  if (isError) {
    throw new Error('something bad happened - this is a sample test error')
  }
  return (
    <button type="button" className={styles.button} onClick={() => setError(true)}>
        {children ?? 'Throw an Error'}
    </button>
  )
}
