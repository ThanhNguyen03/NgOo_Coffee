"use client"
import { useState, useContext } from "react";
import Slider from "react-slick";
import NextArrow from "@/components/icons/NextButton";
import PrevArrow from "@/components/icons/PrevButton";
import PlusIcon from "@/components/icons/Plus";
import MinusIcon from "@/components/icons/Minus";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CartContext } from "../AppContext";
import MenuItemTile from "@/components/menu/MenuItemTile";
import toast from "react-hot-toast";

function MenuSlider({slideShow, slideScoll, menuItems}) {
  const menuItem = menuItems.filter((menuItem) => menuItem.onSale);

  const {addToCart} = useContext(CartContext);
  const [showPopup, setShowPopup] = useState(false);
  const [itemInfo, setItemInfo] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedExtras, setSeletedExtras] = useState([]);
  const [price, setPrice] = useState(0);
  let [quantity, setQuantity] = useState(1);

  function handleAddToCart(item) {
    const {image, itemName, description, basePrice, sizes, extraIngredientPrices} = item;
    if (sizes.length === 0 && extraIngredientPrices.length === 0) {
      addToCart(item);
      toast.success('Added to cart!');
    } else {
      setShowPopup(true);
      setSelectedSize(sizes?.[0] || null);
      setItemInfo(item);
      setPrice(basePrice);
    }
  }

  function handleAddToCartPopupItem(item) {
    if (showPopup) {
      addToCart(item, selectedSize, selectedExtras, quantity);
      setShowPopup(false);
      toast.success('Added to cart!');
    }
  }

  function handleSelectExtras(e, extra) {
      const checked = e.target.checked;
      if (checked) {
          setSeletedExtras(prevExtra => [...prevExtra, extra]);
      } else {
          setSeletedExtras(prevExtra => {
              return prevExtra.filter(ext => ext.name !== extra.name)
          });
      }
  };

  function increaseQuantity() {
      setQuantity(quantity+=1);
  }

  function decreaseQuanlity() {
      if (quantity > 0) {
          setQuantity(quantity-=1);
      }
  }

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: slideShow,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: false,
    slidesToScroll: slideScoll,
    nextArrow: <NextArrow/>,
    prevArrow: <PrevArrow/>
  };

  let selectedPrice = price;
  if (selectedSize) {
      selectedPrice += selectedSize.price;
  }
  if (selectedExtras?.length > 0) {
      selectedExtras.map(extra => selectedPrice += extra.price);
  }
  selectedPrice*=quantity;
  
  return (
    <>
      <Slider {...settings}>
        {menuItem?.length > 0 && menuItem.map((item, index) => (
          <MenuItemTile key={index} {...item} onAddToCart={() => handleAddToCart(item)}/>
        ))}
      </Slider>
      {showPopup && itemInfo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-10" onClick={() => setShowPopup(false)}>
          <div className="bg-secondary px-4 pt-4 rounded-lg w-[30vw] max-h-[70vh] overflow-y-scroll" onClick={e => e.stopPropagation()}>
            <div className="overflow-hidden mx-auto rounded-md flex justify-center">
                <div style={{ backgroundImage: `url(${itemInfo.image})` }} alt="panacotta" className="bg-cover bg-center rounded-md w-80 h-80"/>
            </div>
            <h4 className="font-semibold text-xl my-2 text-center">{itemInfo.itemName}</h4>
            <p className="text-gray-500 text-sm text-center mb-3">
                {itemInfo.description}
            </p>
            {itemInfo.sizes?.length > 0 && (
                <div className="bg-brown rounded-t-md p-2 text-white">
                    <h3 className="text-center">Pick your size</h3>
                    {itemInfo.sizes.map((size, index) => (
                        <label key={index} className="flex p-3 rounded-md border items-center justify-between gap-2 text-white mb-1">
                            <div className="flex justify-center items-center gap-4">
                                <input type="radio" name="size" onClick={() => setSelectedSize(size)} checked={selectedSize?.name === size.name}/> 
                                {size.name}
                            </div>
                            {itemInfo.basePrice + size.price}.000VNĐ
                        </label>
                    ))}
                </div>
            )}
            {itemInfo.extraIngredientPrices?.length > 0 && (
                <div className="bg-brown rounded-b-md p-2 text-white">
                    <h3 className="text-center">Any Extras?</h3>
                    {itemInfo.extraIngredientPrices.map((extra, index) => (
                        <label key={index} className="flex p-3 rounded-md border items-center justify-between gap-2 text-white mb-1">
                            <div className="flex justify-center items-center gap-4">
                                <input type="checkbox" name={extra.name} onClick={(e) => handleSelectExtras(e, extra)}/> 
                                {extra.name}
                            </div>
                            +{extra.price}.000VNĐ
                        </label>
                    ))}
                </div>
            )}
            <div className="flex border-2 border-brown p-2 rounded-full items-center gap-8 mt-2 w-fit mx-auto select-none">
                <div onClick={increaseQuantity}>
                    <PlusIcon/>
                </div>
                {quantity}
                <div onClick={decreaseQuanlity}>
                    <MinusIcon/>
                </div>
            </div>
            <div className="sticky bottom-0 mt-5 bg-secondary py-1">
              <button className="bg-orange-600 hover:bg-primary duration-300" onClick={() => handleAddToCartPopupItem(itemInfo)}>
                  <p className="text-white">Add to cash {selectedPrice}.000VNĐ</p>
              </button>
              <button className="mt-2 bg-white" onClick={() => setShowPopup(false)}>
                  Cancle
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MenuSlider;