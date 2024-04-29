export default function MenuItemTile({onAddToCart, ...item}) {
    const {image, itemName, description, basePrice, sizes, extraIngredientPrices,} = item;

    return (
        <div className="bg-secondary p-4 rounded-lg text-center shadow-custom hover:translate-y-[-20px] duration-500 group w-72 h-[420px] flex flex-col justify-between transition-all custom-max:mx-auto">
            <div>
                <div className="overflow-hidden mx-auto rounded-md">
                    <div style={{ backgroundImage: `url(${image})` }} alt="panacotta" className={`bg-cover bg-center rounded-md w-64 h-64 fade-in`}/>
                </div>
                <h4 className=" font-semibold text-xl mt-2">{itemName}</h4>
            </div>
            <p className="text-gray-500 text-sm line-clamp-2 text-center">
                {description}
            </p>
            <button className="bg-orange-600 rounded-full px-6 py-2 mt-4 hover:bg-primary duration-300"
                onClick={onAddToCart}>
                <p className="text-white text-sm">Add to cash {basePrice}.000VNĐ</p>
            </button>
        </div>
    );
}