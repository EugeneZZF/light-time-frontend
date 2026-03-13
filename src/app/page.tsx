import { CalcContainer } from "@/widgets/calcContainer/index";
import SpecContainer from "../widgets/specContainer/index";
import CatalogContainer from "@/widgets/catalogContainer/index";
// import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col">
      <SpecContainer></SpecContainer>
      <CalcContainer></CalcContainer>
      <CatalogContainer></CatalogContainer>
    </div>
  );
}
