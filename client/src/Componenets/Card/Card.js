import './Card.css';
import Main from "../Main/Main.js";
import { useProductContext } from "../operations/ProductContext.js";
import { useEffect, useState } from "react";
import { AiOutlinePercentage } from "react-icons/ai";
import testimonials from "../utilities/constant.js";

function Card({ name, search }) {
  const { handleNext, handlePrev, currentIndex } = useProductContext();
  const [product, setProducts] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("https://furniture-management-system-3.onrender.com/api/imgs"); 
        const data = await res.json();
      
        if (Array.isArray(data.products)) {
          console.log(data.products[0].image);
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const filterProduct = product.filter((prod) => {
    const searchVal = search.trim().toLowerCase();
    const tagVal = name.toLowerCase();

    if (searchVal && tagVal !== "all") {
      return (
        prod.title.toLowerCase().includes(searchVal) &&
        prod.tags?.toLowerCase().includes(tagVal)
      );
    }

    if (searchVal) {
      return prod.title.toLowerCase().includes(searchVal);
    }

    if (tagVal !== "all") {
      return prod.tags?.toLowerCase().includes(tagVal);
    }

    return true;
  });

  return (
    <>
      <div className="product-display">
        <div className="product-box">
          {console.log(filterProduct)}
          {filterProduct.map((product) => (
            <Main
              key={product._id}
              product={{
                ...product,
                imageUrl: `${product.image}`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container">
        <div className="offers">
          <p><AiOutlinePercentage />No Cost EMI<span>On Leading Banks</span></p>
          <p>Free Delivery & Installation<span>across all major cities</span></p>
          <p>100+ Experience Store<span>Get extra upto 10% offer</span></p>
        </div>

        {testimonials.length > 0 && (
          <>
            <div className="testimonials">
              <div className="testimonials-quote">
                {testimonials[currentIndex].testimonial}
              </div>
              <div className="testimonials-author">
                - {testimonials[currentIndex].name}
              </div>
            </div>
            <div className="btns-testimonials">
              <button onClick={handlePrev}>Prev</button>
              <button onClick={handleNext}>Next</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Card;
