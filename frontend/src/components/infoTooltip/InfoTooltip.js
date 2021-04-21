import React from "react";
import check from "../../images/check.svg";
import xmark from "../../images/xmark.svg";
function InfoTooltip({ isOpen, registered, onClose}) {
  return (
    <div
      className={`popup ${isOpen ? "popup_opened" : ""}`}
      onClick={(evt) => {
        if (evt.target.classList.contains('popup')) { onClose() };
      }}>
      <div className="info-tooltip">
        <img src={registered ? check : xmark} alt="Логотип" className="info-tooltip__image" />
        <p className="info-tooltip__message">{registered ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте ещё раз."}</p>
        <button type="button" className="popup__close-button" onClick={onClose}></button>
      </div>
    </div>
  );
}
export default InfoTooltip;