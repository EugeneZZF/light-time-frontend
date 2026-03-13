export default function CalcButton() {
  return (
    <button
      className="w-[251px] h-[64px] flex gap-[30px] bg-[#ffb63e] items-center pl-[30px]
    bg-gradient-to-b from-[#FFD046] to-[#FF9836] shadow-[0px_1px_5px_rgba(0,0,0,0.2)]
    "
    >
      <img src="./header/calcButton.png"></img>
      <p className="flex text-start text-[22px] leading-[22px] font-bold">
        Расчет <br /> освещения
      </p>
    </button>
  );
}
