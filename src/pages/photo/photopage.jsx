import styles from './photopage.module.scss'
import Masonry from 'react-masonry-css'
import useSWR from 'swr'
import Loading from '../../components/loading/loading'
import { useEffect, useState, useRef } from 'react'

const option = {
  headers: {
    "content-type": "application/json",
    "x-api-key": import.meta.env.VITE_APP_CAT_API_KEY,
  },
};

const fetcher = (...args) => fetch(...args, option).then(res => res.json())

const PhotoPage = () => {
  const [photos, setPhotos] = useState([])
  const [page, setPage] = useState(1)
  const loader = useRef(null)

  const photoSet = useRef(new Set())

  const { data, error, isLoading } = useSWR(`https://api.thecatapi.com/v1/images/search?limit=12&page=${page}`, fetcher, { revalidateOnFocus: false, revalidateIfStale: false })

  useEffect(() => {
    if (data) {
      const uniqueNewPhotos = data.filter(photo => !photoSet.current.has(photo.id))
      uniqueNewPhotos.forEach(photo=> photoSet.current.add(photo.id))
      setPhotos(prePhotos => [...prePhotos, ...uniqueNewPhotos])
    }

  }, [data])

  useEffect(() => {
    const currentLoader = loader.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage(prevPage => prevPage + 1)
        }
      },
      {
        rootMargin: '200px 0px 0px 0px',
        threshold: 0,
      }
    )
    if (currentLoader) {
      observer.observe(currentLoader)
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader)
      }
    }
  },[loader.current])

  const breakpointColumnsObj = {
    default: 4,
    1488: 3,
    1140: 2,
    768: 1
  };

  if (error) return <div>something wrong!</div>
  if (photos.length === 0 && isLoading) return <div className={styles.loading}>
    <Loading
      position={'fiexd'}
      height={'100vh'}
      width={'100vw'}
      background={'#ffffff50'}
    />
  </div>

  return (
    <section className={styles.container}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.waterfall}
        columnClassName={styles.gridColumn}
      >
        {photos.length !== 0 && photos.map(photo => {
          return (
            <img src={photo.url} alt='cat_img' key={photo.id} className={styles.img} />
          )
        })}
      </Masonry>
      {photos.length !== 0 && isLoading && (
        <div className={styles.pageLoading}>
          <Loading
            position={'absolute'}
            height={'120px'}
            width={'100vw'}
            background={'none'}
          />
        </div>
      )}
      <div ref={loader} className={styles.loader}></div>
    </section>
  )
}

export default PhotoPage