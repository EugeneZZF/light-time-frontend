import CalcButton from "@/shared/ui/CalcButton";

export default function CalcContainer() {
  return (
    <div
      className="pl-[40px] pr-[40px] mt-[40px] mb-[40px]
     flex gap-[55px] items-center"
    >
      <div className="flex flex-col w-[665px] h-[177px]">
        <h1 className="w-[460px] text-[28px] leading-[30px] font-bold text-[#009e39] mb-[20px]">
          Светильники оптом от мировых прозводителей
        </h1>
        <p className="text-[16px] text-[#5d5d5d] leading-[24px]">
          Лайт Тайм — это оптовая светотехническая компания, которая успешно
          развивается
          <br /> не один год, объединяя в своем составе самых опытных и
          творческих специалистов.
          <br /> Мы оказываем комплекс услуг по подбору и расчету освещения
          любой степени сложности.
        </p>
      </div>
      <CalcButton></CalcButton>
    </div>
  );
}
