export default function Hero() {
    return (
      <section id="beranda" className="relative h-[60vh] md:h-screen w-full overflow-hidden">
        <img 
          src="/images/huha.png" 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
      </section>
    );
  }