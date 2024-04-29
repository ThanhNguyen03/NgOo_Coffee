import { cartProductPrice } from "@/components/AppContext";

export default function TotalCartPrice({cartProducts, className = 'pt-8 pr-28 flex justify-end items-center'}) {
    let totalPrice = 0;
    let deliveryPrice = 0;
    for (const product of cartProducts) {
        totalPrice += cartProductPrice(product);
    };
    if (totalPrice < 80) {
        deliveryPrice = 10;
        totalPrice+=deliveryPrice;
    }

    return (
        <div className={className}>
            <div className="flex flex-col">
                <span className="text-gray-700">Delivery:</span><br/>
                <span>Total price:</span>
            </div>
            <div className="text-right flex flex-col">
                <span className="font-semibold pl-2">{deliveryPrice}.000VNĐ</span><br/>
                <span className="text-third font-semibold text-lg pl-2">{totalPrice}.000VNĐ</span>
            </div>
        </div>
    );
}