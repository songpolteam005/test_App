"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Search, Menu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      
      {/* --- Navbar (Minimalist) --- */}
      <nav className="fixed w-full z-50 top-0 bg-white/90 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tighter uppercase group">
            Art<span className="font-light text-zinc-400 group-hover:text-black transition-colors">Space.</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-12 text-sm font-medium tracking-wide text-zinc-500">
             <Link href="#" className="hover:text-black transition">SCULPTURE</Link>
             <Link href="#" className="hover:text-black transition">PAINTING</Link>
             <Link href="#" className="hover:text-black transition">PHOTOGRAPHY</Link>
             <Link href="#" className="hover:text-black transition">NFT</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
             <button className="text-zinc-400 hover:text-black transition"><Search size={20}/></button>
             <div className="h-4 w-[1px] bg-zinc-200"></div>
             <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
                Log in
             </Link>
             <Link href="/register" className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-zinc-800 transition shadow-lg shadow-black/10">
                Sign up
             </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section (Asymmetrical) --- */}
      <section className="pt-32 pb-20 px-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Typography */}
            <div className="lg:col-span-5 space-y-8">
                <div className="inline-block px-3 py-1 border border-black rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                    New Collection
                </div>
                <h1 className="text-6xl md:text-8xl font-medium tracking-tighter leading-[0.9]">
                    Pure <br/> <span className="text-zinc-300">Form.</span>
                </h1>
                <p className="text-lg text-zinc-500 max-w-md leading-relaxed">
                    ค้นพบความงามที่ไร้กาลเวลา แพลตฟอร์มซื้อขายงานศิลปะที่คัดสรรเฉพาะผลงานระดับมาสเตอร์พีซ เพื่อนักสะสมตัวจริง
                </p>
                <div className="pt-6 flex gap-4">
                    <Link href="/register" className="px-8 py-4 bg-black text-white rounded-full flex items-center gap-2 hover:scale-105 transition duration-300 shadow-xl">
                        Start Collecting <ArrowRight size={18}/>
                    </Link>
                    <button className="px-8 py-4 border border-zinc-200 text-black rounded-full hover:bg-zinc-50 transition">
                        View Gallery
                    </button>
                </div>
            </div>

            {/* Hero Images (Masonry Layout) */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-6 relative">
                 <div className="space-y-6 mt-12">
                     <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000&auto=format&fit=crop" className="w-full h-64 object-cover rounded-none grayscale hover:grayscale-0 transition duration-700" alt="Art 1"/>
                     <img src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1000&auto=format&fit=crop" className="w-full h-80 object-cover rounded-none grayscale hover:grayscale-0 transition duration-700" alt="Art 2"/>
                 </div>
                 <div className="space-y-6">
                     <img src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1000&auto=format&fit=crop" className="w-full h-96 object-cover rounded-none grayscale hover:grayscale-0 transition duration-700" alt="Art 3"/>
                     <div className="bg-zinc-100 p-8 flex items-center justify-center text-center h-48">
                        <div>
                            <p className="text-4xl font-bold">500+</p>
                            <p className="text-zinc-500 text-sm mt-2">Curated Artists</p>
                        </div>
                     </div>
                 </div>
            </div>
        </div>
      </section>

      {/* --- Featured Works (Clean Grid) --- */}
      <section className="py-24 border-t border-zinc-100">
        <div className="max-w-[1600px] mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
                <h2 className="text-3xl font-medium tracking-tight">Latest Acquisitions</h2>
                <Link href="#" className="text-sm font-bold border-b border-black pb-1 hover:text-zinc-600 transition">VIEW ALL</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="group cursor-pointer">
                        <div className="relative overflow-hidden bg-zinc-100 mb-4 aspect-[4/5]">
                            <img 
                                src={`https://images.unsplash.com/photo-${item === 1 ? '1578301978693-85e6c0c67947' : item === 2 ? '1579783902614-a3fb39279c75' : '1605721911519-3dfeb3be25e7'}?q=80&w=800&auto=format&fit=crop`} 
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-in-out"
                                alt="Artwork"
                            />
                            <button className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 shadow-lg hover:bg-black hover:text-white">
                                <ShoppingBag size={18} />
                            </button>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-medium group-hover:underline decoration-1 underline-offset-4">Abstract No. {item}</h3>
                                <p className="text-zinc-500 text-sm">Oil on Canvas</p>
                            </div>
                            <span className="font-mono text-sm">฿ 12,500</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- Minimal Footer --- */}
      <footer className="bg-black text-white py-20 px-6">
        <div className="max-w-[1600px] mx-auto grid md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
                <h2 className="text-2xl font-bold tracking-tighter uppercase mb-6">ArtSpace.</h2>
                <p className="text-zinc-500 max-w-sm">
                    Reimagining the digital art gallery experience. 
                    Connecting visionary artists with discerning collectors.
                </p>
            </div>
            <div>
                <h4 className="font-bold mb-4 text-zinc-300">Marketplace</h4>
                <ul className="space-y-2 text-zinc-500 text-sm">
                    <li><a href="#" className="hover:text-white transition">All Artworks</a></li>
                    <li><a href="#" className="hover:text-white transition">New Arrivals</a></li>
                    <li><a href="#" className="hover:text-white transition">Artists</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-4 text-zinc-300">Support</h4>
                <ul className="space-y-2 text-zinc-500 text-sm">
                    <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                    <li><a href="/login" className="hover:text-white transition">Log In</a></li>
                    <li><a href="/register" className="hover:text-white transition">Register</a></li>
                </ul>
            </div>
        </div>
      </footer>
    </div>
  );
}