import { Bar } from "./Bar";
import { BottomHeader } from "./Bottom_header";

export function Header() {
  return (
    <div className="w-full font-sans">
      <Bar />
      <BottomHeader />
    </div>
  );
}
