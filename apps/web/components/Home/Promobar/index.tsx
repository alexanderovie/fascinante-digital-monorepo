interface PromobarProps {
  dict: {
    item1: string;
    item2: string;
    item3: string;
    item4: string;
    item5: string;
  };
}

function Promobar({ dict }: PromobarProps) {
  const promobarData = [
    dict.item1,
    dict.item2,
    dict.item3,
    dict.item4,
    dict.item5,
  ];

  return (
    <section>
      <div className="bg-primary flex overflow-hidden">
        <div className="flex animate-scroll">
          {/* Renderizar múltiples veces para efecto continuo */}
          {[...Array(3)].map((_, repeatIndex) => (
            promobarData.map((value, index) => (
              <div key={`${repeatIndex}-${index}`} className="flex items-center py-2.5 gap-6 pr-6 md:pr-10 md:gap-10 whitespace-nowrap">
                <p className="font-medium text-white">{value}</p>
                <div className="w-16 h-[1px] bg-white/30" />
              </div>
            ))
          ))}
        </div>
      </div>
    </section>
  )
}
export default Promobar;
