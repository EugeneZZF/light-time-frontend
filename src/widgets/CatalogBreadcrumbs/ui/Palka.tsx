import Image from "next/image";

export default function Palka() {
  return (
    <Image
      alt="palka"
      width={1}
      height={1}
      className="w-[16px] h-[37px"
      src={"/palka.jpg"}
    ></Image>
  );
}
