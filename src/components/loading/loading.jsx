import styles from './loading.module.scss';

const Loading = ({ position, height, width, background }) => {
  return (
    <div className={styles.container} style={{ position, height, width, background }} >
      <div className={styles.laBallSpinClockwise}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default Loading;