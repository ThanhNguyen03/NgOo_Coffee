import Image from "next/image";
import RightArrow from "../icons/RightArrow";

export default function Hero () {
    return (
        <section className="flex custom-min:hero mask-img bg-primary rounded-b-lg h-[calc(100vh-22px)] pt-[80px]">
            <div className="realtive mx-auto my-auto custom-min:pl-32 custom-max:px-12">
                <h1 className="text-5xl font-semibold text-secondary custom-max:text-center">
                    Everything <br/> is better with<br/> 
                    <span className="text-orange-600">
                        NgOo&nbsp;
                    </span>
                    Coffee
                </h1>
                <p className="my-6 text-white text-2xl font-sans custom-max:text-center">
                    NgOo Coffee is the missing piece that makes everyday complete, a simple yet delicious joy in life
                </p>
                <div className="flex gap-4 text-lg custom-max:justify-center">
                    <button className="except-button items-center uppercase bg-third hover:bg-secondary hover:text-primary text-white flex gap-2 px-4 py-2 rounded-full
                    duration-1000 relative button-hover">
                        Order now
                        <RightArrow />
                    </button>
                    <button className="except-button flex gap-2 py-2 font-semibold text-white items-center">
                        Learn more
                    </button>
                </div>
            </div>
            <div className="relative mx-auto my-auto hidden custom-min:block">
                <Image src={'/fbcover (1).png'} alt={'logo'} width={700} height={500} objectFit="contain"></Image>
            </div>
        </section>
    );
}