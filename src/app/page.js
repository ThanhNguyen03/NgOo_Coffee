"use client"
import { useState } from "react";
import Hero from "../components/layout/Hero";
import HomeMenu from "../components/layout/HomeMenu";
import SectionHeaders from "../components/layout/SectionHeader";

export default function Home() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <>
      <Hero id="hero"/>
      <HomeMenu id="home-menu"/>
      <section id="about" className="text-center mt-12 mb-8">
        <SectionHeaders subHeader={'Our Story'} mainHeader={'About us'}/>
        <div className="text-gray-500 max-w-2xl mx-auto mt-4 flex flex-col gap-4">
          <p>
            NgOo EST. 2023, Còn bạn? <br/>
            Started when we was 20! <br/>
          </p>
          <p>
            Nhắc nhỏ cho mọi người nhớ rằng, vào tháng 7 này khi đặt bất kì món nước nào 
            của NgOo với số lượng 2 ly trở lên thì sẽ được tặng miễn phí 2 Panna Cotta. 
          </p>
          <p>
            Và chắc chắn sắp tới NgOo sẽ ra mắt rất nhiều món mới để phục vụ mọi người. 
            Vì thế mọi người nhớ like cũng như là theo dõi NgOo để cập nhật thông tin mới sớm nhất nha!
          </p>
          <p>
            Biết đâu, crush của bạn thích món nước đó thì sao.
            Vậy thì còn chần chờ gì nữa mà không nhanh tay mà đặt nước cho bản thân cùng người aays!
          </p>
        </div>
      </section>
      <section id="contact" className="mt-16">
        <div className="text-center ">
          <SectionHeaders subHeader={'Don\'t hesitate'} mainHeader={'Contact us'}/>
        </div>
        <div className="max-w-4xl p-4 rounded-lg bg-brown mx-auto mt-10">
          <form>
            <label className="text-white">Email</label>
            <input type="text" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)}/>
            <label className="text-white">Phone Number</label>
            <input type="tel" placeholder="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)}/>
            <label className="text-white">Feedback or Contact to NgOo</label>
            <textarea placeholder="Your Feedbacks" value={notes} onChange={e=>setNotes(e.target.value)}/>
            <div className="mx-auto w-fit">
              <button type="submit">Send Feedback</button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
