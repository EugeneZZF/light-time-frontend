type Props = {
  index: number;
};

export default function MagazineCard({ index }: Props) {
  return (
    <a
      href={`/other/roznichnyy_magazin_${index + 1}.jpg`}
      className="w-[170px] h-[113px] bg-cover bg-center"
      style={{
        backgroundImage: `url(/other/roznichnyy_magazin_${index + 1}.jpg)`,
      }}
    />
  );
}
