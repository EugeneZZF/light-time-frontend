import FooterSlider from "./FooterSlider";
import FooterBottom from "./FooterBottom";

export function Footer() {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-[#f5f5f5] px-4 py-10">
      <div className="w-full max-w-[1100px]">
        <FooterSlider />
      </div>
      <hr className="mb-[30px] mt-[30px] w-full border-t border-[#e8e8e8]" />
      <div className="w-full max-w-[1100px]">
        <FooterBottom />
      </div>
    </div>
  );
}
