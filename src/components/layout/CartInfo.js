import {cartProductPrice } from "@/components/AppContext";


export default function CartInfo({product, children}) {

    return (
        <>
            <div className="flex custom-500:flex-col gap-4 items-center border-b py-4 max-w-2xl mx-auto">
                <div className="overflow-hidden rounded-md">
                    <div style={{ backgroundImage: `url(${product.image})` }} alt="panacotta" className="bg-cover bg-center rounded-md w-28 h-28 fade-in"/>
                </div>
                <div className="grow">
                    <h3 className="font-semibold text-brown">{product.itemName}</h3>
                    {product.size && (
                        <div className="text-sm italic">
                            Size: <span className="text-gray-500">{product.size.name}</span>
                        </div>
                    )}
                    {product.extras?.length > 0 && (
                        <div className="text-sm italic flex gap-4 items-center">
                            Extras: 
                            <div>
                                {product.extras.map((extra, index) => (
                                    <div key={index} className="grid grid-cols-2 text-gray-500 pl-2 border-l-2 gap-2">
                                        <div className="">{extra.name}</div>
                                        <div>{extra.price}.000VNĐ</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="font-semibold text-primary text-sm">
                    {cartProductPrice(product)}.000VNĐ
                </div>
                <div className="flex border p-2 rounded-2xl items-center gap-4">
                    {children}
                </div>
            </div>
        </>
    );
}