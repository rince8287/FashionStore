import { useEffect, useState } from "react";

function ProductGallery({ product }) {
  const images = [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  const [selectedImage, setSelectedImage] = useState(product.image);

  useEffect(() => {
    setSelectedImage(product.image);
  }, [product]);

  return (
    <div className="w-full space-y-4 md:space-y-6">
      {/* Main Image */}
      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
        <img
          src={selectedImage}
          alt={product.name}
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedImage(image)}
            className={`overflow-hidden rounded-xl border transition-all duration-300 ${
              selectedImage === image
                ? "border-2 border-accent"
                : "border-border-subtle hover:border-accent"
            }`}
          >
            <img
              src={image}
              alt={`${product.name} ${index + 1}`}
              className="aspect-square w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;