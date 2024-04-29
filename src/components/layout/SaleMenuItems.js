"use client"
import MenuSlider from "@/components/layout/MenuSlider";
import SectionHeaders from "./SectionHeader";
import { useState, useEffect } from "react";

export default function SaleMenuItems({menuItems}) {
    const [slideShow, setSlideShow] = useState(3); // Initial values (optional)
    const [slideScoll, setSlideScoll] = useState(1);
  
    const handleWindowSizeChange = () => {
      const width = window.innerWidth;
      setSlideShow(width < 900 ? 1 : 3);
    };
  
    useEffect(() => {
      handleWindowSizeChange();
      window.addEventListener('resize', handleWindowSizeChange);
  
      return () => window.removeEventListener('resize', handleWindowSizeChange);
    }, []);

    return (
      <>
        <div className="text-center mb-8">
            <SectionHeaders subHeader={'check'} mainHeader={'Hot Sale!!!'}/>
        </div>
        <div className="justify-center items-center flex">
            <MenuSlider slideShow={slideShow} slideScoll={slideScoll} menuItems={menuItems}/>
        </div>
      </>
    );
}