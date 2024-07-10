import { useState, useEffect, useContext } from "react";
import StarRatings from "react-star-ratings";
import Header from "./Header";
import Footer from "./Footer";
import { HiOutlineHeart, HiOutlineEye } from "react-icons/hi";
import { CartContext } from "../context/cart-context";
import { WishListContext } from "../context/wishlist-context";
import { ItemSkeleton2 } from "../skeletons/ItemSkeleton";
import { Link } from "react-router-dom";

export default function AllProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { addToWishList } = useContext(WishListContext);

  async function getProducts() {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch("../data/allProductsStore.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      const data = JSON.parse(text);
      setProducts(data.allProductsStore);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <Header />
      <section className="w-full px-[7%] my-20">
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-[1.3rem] h-[3rem] rounded-md bg-accent"></span>
          <h1 className="text-base text-action font-bold">Our Products</h1>
        </div>
        <div className="flex w-full gap-6 flex-wrap justify-center">
          {loading
            ? Array.from({ length: 28 }).map((_, index) => (
                <ItemSkeleton2 key={index} />
              ))
            : products.map((product) => (
                <div key={product.id} className="flex flex-col gap-1 w-[14rem] max-sm:w-[9rem]">
                  <div className="group overflow-hidden flex flex-col items-center justify-center w-full h-[13rem] max-sm:h-[10rem] rounded-md p-4 bg-secondary relative">
                    <img
                      className="hover:scale-[1.2] transition-all"
                      src={product.img}
                      alt={product.alt}
                      loading="lazy"
                    />
                    {product.new && (
                      <span className="absolute w-max h-max px-2 rounded-md bg-green-cus left-3 top-2 text-sm text-primary">
                        {product.new}
                      </span>
                    )}
                    <div className="absolute top-2 right-3 flex flex-col gap-4">
                      <button
                        className="bg-white w-6 h-6 rounded-full flex items-center justify-center p-[1px]"
                        onClick={() => addToWishList(product)}
                      >
                        <HiOutlineHeart className="w-full h-full" />
                      </button>
                      <Link
                        to={`/product/${product.id}`}
                        className="bg-white w-6 h-6 rounded-full flex items-center justify-center p-[1px]"
                      >
                        <HiOutlineEye className="w-full h-full" />
                      </Link>
                    </div>
                    <button
                      className="w-full h-[2rem] absolute bottom-0 bg-black text-primary hidden group-hover:block max-sm:block"
                      onClick={() => addToCart(product)}
                    >
                      Add To Cart
                    </button>
                  </div>
                  <h3 className="text-md font-medium">{product.name}</h3>
                  <div className="flex gap-2 items-center max-sm:items-start max-sm:flex-col">
                    <span className="text-action">{`$${product.price}`}</span>
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
                </div>
              ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
