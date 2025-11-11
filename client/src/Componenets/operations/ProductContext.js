import { createContext, useContext, useEffect, useState } from "react";
import { useToken } from "../../TokenContext";
import testimonials from "../utilities/constant";

const ProductContext = createContext();
export const useProductContext = () => useContext(ProductContext);

export function ProductProvider({ children }) {
  const { token } = useToken();
  const [fav, setFav] = useState([]);
  const [cart, setCart] = useState([]);
  const [globalmessage, setGlobalMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // ===================== FAVORITES =====================

  useEffect(() => {
    if (!token) return;
    fetchFavs();
    fetchCart();
  }, [token]);

  const fetchFavs = async () => {
    if (!token) return;

    try {
      const response = await fetch(" https://furniture-management-system-3.onrender.com/api/favourites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setFav(data.favourites || []);
      } else {
        console.error("Failed to fetch favorites");
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const add_fav = async (product) => {
    if (!product || !product.title || !token) return "Error occurred";

    try {
      const response = await fetch(" https://furniture-management-system-3.onrender.com/api/favourites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: product.title }),
      });

      const data = await response.json();
      if (response.ok) {
        setFav((prev) => [...prev, product]);
        setGlobalMessage("Added to favourites");
        setTimeout(() => setGlobalMessage(""), 2000);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Add fav error:", err);
    }
  };

  const remove_fav = async (product) => {
    if (!product || !product.title || !token) return;

    try {
      const response = await fetch(
        ` https://furniture-management-system-3.onrender.com/api/favourites/${product.title}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setFav((prev) =>
          prev.filter((item) => item.title !== product.title)
        );
        setGlobalMessage("Removed from favourites");
        setTimeout(() => setGlobalMessage(""), 2000);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Remove fav error:", err);
    }
  };

  const isFav = (item) => {
    if (!item || !item.title) return false;
    return fav.some((f) => f?.title === item.title);
  };

  // ===================== CART =====================

  const fetchCart = async () => {
    try {
      const response = await fetch(" https://furniture-management-system-3.onrender.com/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data.products || []);
      } else {
        console.error("Error fetching cart");
      }
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  const add_cart = async (product) => {
  
    if (!product || !product._id || !token) return;

    try {
      const response = await fetch(" https://furniture-management-system-3.onrender.com/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          name: product.title,
         price: Number(product.price.replace(/[^0-9.-]+/g, "")),
          filename: product.image,
          quantity: 1,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data.cart?.products || []);
        setGlobalMessage("Added to cart");
        setTimeout(() => setGlobalMessage(""), 2000);
      } else {
        console.error("Add cart error:", data.message);
      }
    } catch (err) {
      console.error("Add cart fetch error:", err);
    }
  };

const remove_cart = async (product) => {
  // Check that nested ID exists
  if (!product || !product.productId || !product.productId._id || !token) return;

  const productId = product.productId._id;

  try {
    const response = await fetch(` https://furniture-management-system-3.onrender.com/api/cart/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      setCart(data.cart?.products || []);
      setGlobalMessage("Removed from cart");
      setTimeout(() => setGlobalMessage(""), 2000);
    } else {
      console.error("Remove cart error:", data.message);
    }
  } catch (err) {
    console.error("Remove cart fetch error:", err);
  }
};

const increase_quantity = async (product) => {
  const productId =
    product?._id || product?.productId?._id || product?.productId;
  if (!productId || !token) return;

  try {
    const res = await fetch(` https://furniture-management-system-3.onrender.com/api/cart/increase/${productId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      setCart(data.cart?.products || []);
    } else {
      console.error("Increase quantity error:", data.message);
    }
  } catch (err) {
    console.error("Increase quantity fetch error:", err);
  }
};
const decrease_quantity = async (product) => {
  const productId =
    product?._id || product?.productId?._id || product?.productId;
  if (!productId || !token) return;

  try {
    const res = await fetch(` https://furniture-management-system-3.onrender.com/api/cart/decrease/${productId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      setCart(data.cart?.products || []);
    } else {
      console.error("Decrease quantity error:", data.message);
    }
  } catch (err) {
    console.error("Decrease quantity fetch error:", err);
  }
};
const clear_cart = async () => {
  if (!token) return;

  try {
    const res = await fetch(" https://furniture-management-system-3.onrender.com/api/cart", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      setCart([]);
      setGlobalMessage("Cart cleared");
      setTimeout(() => setGlobalMessage(""), 2000);
    } else {
      console.error("Clear cart error:", data.message);
    }
  } catch (err) {
    console.error("Clear cart fetch error:", err);
  }
};

  const isInCart = (product) => {
    if (!product || !product._id) return false;
    return cart.some((item) => item.productId === product._id);
  };

  // ===================== TESTIMONIAL CAROUSEL =====================

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
<ProductContext.Provider
  value={{
    fav,
    add_fav,
    remove_fav,
    isFav,
    cart,
    add_cart,
    remove_cart,
    increase_quantity,
    decrease_quantity,
    clear_cart,
    isInCart,
    globalmessage,
    currentIndex,
    handlePrev,
    handleNext,
  }}
>

      {children}
    </ProductContext.Provider>
  );
}
