import React, { useState, useEffect, useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import AddToCart from "../helpers/AddToCart";
import { Link } from "react-router-dom";

const VarticalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]); // To store the product data
  const [loading, setLoading] = useState(false); // To track loading state
  const containerRef = useRef(null); // Ref to control scrolling

  // Fetch the data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:4000/api/category-product?category=${category}`
        );
        const result = await response.json();

        // Check if the response is successful and has data
        if (result.success) {
          setData(result.data); // Set the data state with the fetched products
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchData();
  }, [category]); // Re-fetch when category changes

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Render loading state or products
  if (loading) {
    return <div className="text-center p-5">Loading products...</div>;
  }

  return (
    <div className="container mx-auto px-2 my-4 relative">
      <h2 className="text-xl font-semibold mb-4">{heading}</h2>
      <div
        ref={containerRef}
        className="flex items-center gap-3 md:gap-6 overflow-x-auto scrollbar-none scroll-smooth"
      >
        {data.map((product) => (
          <Link
            to={"/product/" + product?._id}
            key={product._id}
            className="w-full min-w-[200px] md:min-w-[240px] max-w-[200px] md:max-w-[240px] bg-white rounded-sm shadow flex flex-col my-4"
          >
            <div className="bg-slate-300 p-2 min-h-[120px] flex justify-center items-center">
              <img
                src={product.imageFiles[0]} // Displaying the first image
                alt={product.productName}
                className="w-full h-full object-contain rounded-sm hover:scale-110 transition-all"
                style={{
                  backgroundColor: "transparent",
                  mixBlendMode: "multiply",
                }}
              />
            </div>
            <div className="flex flex-col justify-between p-3 flex-grow">
              <h3 className="text-sm font-medium md:text-base text-ellipsis line-clamp-1">
                {product.productName}
              </h3>
              <p className="text-xs text-gray-600 text-ellipsis line-clamp-2">
                {product.description || "No description available."}
              </p>
              <p className="text-xs font-bold text-gray-600 text-ellipsis line-clamp-1">
                {product.category}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-bold text-red-600">
                  ₹{product.selling}
                </span>
                <span className="text-xs text-slate-500 line-through">
                  ₹{product.price}
                </span>
              </div>
              <button
                className="bg-red-600 text-white text-xs font-semibold px-3 py-2 mt-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={(e) => {
                  AddToCart(e, product?._id);
                }}
              >
                Add to Cart
              </button>
            </div>
          </Link>
        ))}
      </div>

      {/* Left Scroll Button */}
      <button
        onClick={scrollLeft}
        className="hidden md:block absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
      >
        <FaAngleLeft size={20} />
      </button>

      {/* Right Scroll Button */}
      <button
        onClick={scrollRight}
        className="hidden md:block absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
      >
        <FaAngleRight size={20} />
      </button>
    </div>
  );
};

export default VarticalCardProduct;
