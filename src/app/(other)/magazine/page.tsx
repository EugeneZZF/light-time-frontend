import MagazineCard from "@/shared/ui/MagazineCard";

export default function MagazinePage() {
  const magazineImg = Array.from({ length: 8 });

  return (
    <div>
      <h1 className="text-[28px] text-[#009e39] font-bold">
        Розничный магазин в городе Королев
      </h1>
      <div className="text-[#505050] text-1 flex flex-col gap-[16px] indent-8">
        <p>
          Мы рады приветствовать посетителей в нашем розничном магазине, который
          расположен по адресу: г. Королев, ул. Легостаева д.11, ТЦ «Звёздный»,
          левое крыло здания (если смотреть на фасад), цокольный этаж.
        </p>
        <p>Наш магазин открыт ежедневно с 10:00 до 20:00.</p>
        <p>
          Всегда в наличии продукция ведущих брендов в сфере электротехники и
          освещения.
        </p>
      </div>
      <div className="grid gap-[16px] ml-[32px] gap-x-0 w-[95%] grid-cols-4 my-8">
        {magazineImg.map((_, index) => (
          <MagazineCard key={index} index={index}></MagazineCard>
        ))}
      </div>
      <div className="text-[#505050]  text-1 flex flex-col gap-[16px] indent-8">
        <p>
          Мы с удовольствием ответим на все ваши вопросы по телефону:{" "}
          <span className="text-[19.2px] text-black font-bold">
            +7 (495) 230-03-90
          </span>
          .
        </p>
        <p>Звоните и приезжайте!</p>
      </div>
    </div>
  );
}
