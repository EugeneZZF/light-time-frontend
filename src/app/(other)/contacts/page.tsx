export default function ContactsPage() {
  return (
    <div>
      <h1 className="text-[28px] text-[#009e39] font-bold">Контакты</h1>
      <div className="text-[#505050] text-1 flex flex-col leading-[18px]">
        <p>ООО Компания «Лайт Тайм»</p>
        <p>
          <span className=" font-bold">Адрес:</span> 127081, г. Москва, ул.
          Чермянская, д. 1, стр. 1, офис 108
        </p>
        <p>
          <span className=" font-bold">Электронная почта:</span>{" "}
          info@light-time.ru
        </p>
        <p>
          <span className=" font-bold">Телефон:</span> +7 (495) 268-06-55
        </p>
        <p>
          <span className=" font-bold">Время работы:</span> Пн-Пт: 9:00 - 18:00
        </p>
      </div>
    </div>
  );
}
