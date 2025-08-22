import { useState } from "react"
import "./imageCarousel.css"

interface ImageCarouselProps {
    images: string[]
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {

    const [imageIndex, setImageIndex] = useState(0)
    const [isLoaded, setIsLoaded] = useState(false)

    return (
        <div className="imageCarouselContainer">
            {imageIndex != 0 && isLoaded && <button className="prevBtn" onClick={() => {setIsLoaded(false); setImageIndex(imageIndex-1)}}>{'<'}</button>}
            <object key={images[imageIndex]} data={images[imageIndex]} width="100%" height="100%" onLoad={() => setIsLoaded(true)}>
                <img src="" alt="Post Image" />
                <video src="" controls />
            </object>
            {imageIndex != images.length-1 && isLoaded && <button className="nextBtn" onClick={() => {setIsLoaded(false); setImageIndex(imageIndex+1)}}>{'>'}</button>}
        </div>
    )
}

export default ImageCarousel