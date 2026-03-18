import { News } from "@/entities/news/model/types";
import NewsSmallCard from "@/entities/news/ui/NewsSmallCard";
interface InfoSectionProps {
  news: News[];
}

export default function InfoSection({ news }: InfoSectionProps) {
  return (
    <div className="flex pl-[50px] pr-[50px] gap-[40px]">
      <div className="flex flex-col w-[480px] gap-[20px]">
        <h2 className="text-[#009e39] text-[24px] font-bold leading-[27px]">
          Специальные условия для оптовых покупателей
        </h2>
        <p className="text-[#5d5d5d] text-[16px] ">
          Сотрудничество с «Лайт Тайм» для оптовых покупателей — это мудрое
          решение, так как наши специалисты максимально быстро сформируют
          крупный заказ и организуют его доставку по указанному адресу точно в
          срок с сохранением фирменной упаковки. Кроме того, мы осуществим
          бесплатную доставку, если сумма вашего заказа превысит 20 тысяч
          рублей. При заказе до 20 тысяч и в случае, если вы находитесь в
          пределах Московской области, условия доставки можно обговорить с
          менеджером в индивидуальном порядке. До транспортных компаний мы
          доставим ваш заказ бесплатно.
        </p>
      </div>
      <div className="flex flex-col">
        <h3 className="text-[#009e39] text-[22px] font-bold mb-[10px]">
          Новости
        </h3>
        <div className="flex">
          {news.map((item) => (
            <NewsSmallCard key={item.slug} news={item}></NewsSmallCard>
          ))}
        </div>
      </div>
    </div>
  );
}
