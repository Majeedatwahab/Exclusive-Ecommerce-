import { HiOutlineHeart, HiOutlineEye } from "react-icons/hi";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings"; 
import { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/cart-context";

export default function BestSellingProducts() {
 const [bestSellingProducts, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  async function getProducts() {
  try {
    const response = await fetch('../public/data/bestSellingProducts.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    console.log("Raw response text:", text); 
    const data = JSON.parse(text);
    setProducts(data.bestSellingProducts);  
  }catch (error) {
    console.error('Failed to fetch products:', error);
  }
  }
  useEffect(() => {
    getProducts();
  }, []);
 
  
  return (
    <section className="w-full px-28 my-20">
      <div className="flex items-center gap-3 mb-4">
        <span className="block w-[1.3rem] h-[3rem] rounded-md bg-accent"></span>
        <h5 className="text-base text-action font-bold">This Month</h5>
      </div>
      <div className="flex w-full items-center gap-6 mb-8 justify-between">
        <h2 className="text-3xl font-bold">Best Selling Products</h2>
        <div className="flex items-center gap-4">
          <Link
            className="px-4 py-2 rounded-md bg-action w-max text-primary hover:translate-x-2 hover:-translate-y-1 transition-all"
            to="/"
          >
            View All
          </Link>
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-center gap-6 overflow-x-hidden">
        {bestSellingProducts.map((product) => {
          return (
            <div className="flex flex-col gap-1 w-[14rem]" key={product.id}>
              <div className="group overflow-hidden flex flex-col items-center justify-center w-full h-[13rem] rounded-md p-4 bg-secondary relative ">
                <img
                  className="hover:scale-[1.2] transition-all"
                  src={product.img}
                  alt={product.alt}
                />
                <div className="absolute top-2 right-3 flex flex-col gap-4">
                  <button className="bg-white w-6 h-6 rounded-full flex items-center justify-center p-[1px]">
                    <HiOutlineHeart className="w-full h-full" />
                  </button>
                  <button className="bg-white w-6 h-6 rounded-full flex items-center justify-center p-[1px]">
                    <HiOutlineEye className="w-full h-full" />
                  </button>
                </div>
                <button className="w-full h-[2rem] absolute bottom-0 bg-black text-primary hidden group-hover:block" onClick={() => addToCart(product)}> 
                  Add To Cart
                </button>
              </div>
              <h3 className="text-md font-medium">{product.name}</h3>
              <div className="flex gap-2 items-center">
                <span className="text-action">{`$${product["discount-price"]}`}</span>
                <span className="line-through">{`$${product.price}`}</span>
              </div>
              <div>
                <StarRatings
                  rating={product.stars}
                  starDimension="20px"
                  starSpacing="2px"
                  starRatedColor="orange"
                />
                <span>({product["times rated"]})</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
