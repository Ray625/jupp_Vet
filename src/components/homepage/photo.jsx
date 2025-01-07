import styles from "./photo.module.scss";
import useSWR from 'swr'
import Loading from '../loading/loading'
import { useEffect, useState, useRef } from 'react'

const option = {
  headers: {
    "content-type": "application/json",
    "x-api-key": import.meta.env.VITE_APP_CAT_API_KEY,
  },
};

const fetcher = (...args) => fetch(...args, option).then(res => res.json())

const PhotoSection = () => {
  const [photos, setPhotos] = useState([])
  const photoSet = useRef(new Set())

  const { data, error, isLoading } = useSWR(`https://api.thecatapi.com/v1/images/search?limit=12&page=1`, fetcher, { revalidateOnFocus: false, revalidateIfStale: false })

  useEffect(() => {
    if (data) {
      const uniqueNewPhotos = data.filter(photo => !photoSet.current.has(photo.id))
      uniqueNewPhotos.forEach(photo=> photoSet.current.add(photo.id))
      setPhotos(prePhotos => [...prePhotos, ...uniqueNewPhotos])
    }

  }, [data])

  if (error) return

  return (
    <section className={styles.container} id="photo">
      <div className={styles.titleContainer}>
        <div className={styles.titleGroup}>
          <img
            src="/svg/home_footprint.svg"
            alt="icon"
            className={styles.footprint}
          />
          <h2 className={styles.title}>Our Baby</h2>
        </div>
        <h3 className={styles.subtitle}>來看看小寶貝們的照片</h3>
      </div>
      {(photos.length === 0 && isLoading) && (
        <div className={styles.loading}>
          <Loading
            position={'absolute'}
            height={'20vh'}
            width={'100%'}
            background={'#ffffff50'}
          />
        </div>
      )}
      <div className={styles.body}>
        <div className={styles.marquee}>
          {photos.length !== 0 &&
            photos.map((photo) => {
              return (
                <div className={styles.imgWrapper} key={photo.id}>
                  <img src={photo.url} alt="cat_img" className={styles.img} />
                </div>
              );
            })}
        </div>
        <div className={styles.marquee2}>
          {photos.length !== 0 &&
            photos.map((photo) => {
              return (
                <div className={styles.imgWrapper} key={photo.id}>
                  <img src={photo.url} alt="cat_img" className={styles.img} />
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}

export default PhotoSection;