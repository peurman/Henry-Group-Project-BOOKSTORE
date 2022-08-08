import React, { useEffect, useState } from "react";
import s from "./ForgotPassword.module.sass";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

function ConfirmCode() {
  const dispatch = useDispatch();
  const history = useHistory();

  const isValidInitialState = {
    code: "",
  };

  /////////////STATE???

  const [code, setCode] = useState("");
  const [isValid, setIsvalid] = useState(isValidInitialState);
  const [isPending, setIsPending] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const isValidCopy = { ...isValid };
    if (!code.length) isValidCopy.code = " ";
    else if (code) {
      isValidCopy.code = "Reset code is invalid";
    } else delete isValidCopy.code;
    setIsvalid(isValidCopy);
    let counter = 0;
    for (let err in isValidCopy) {
      if (isValidCopy[err]) counter++;
    }
    if (!counter) setIsAllowed(true);
    else if (counter) setIsAllowed(false);
  }, [code]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    ////////////////DISPATCH
    dispatch(code).then((res) => {
      if (res) {
        /////////////////////RUTA
        history.push("/resetPassword");
        setCode("");
        setIsvalid(isValidInitialState);
        setIsAllowed(false);
        setIsPending(false);
      } else setIsPending(false);
    });
  };

  const handleButton = () => {
    if (!isPending && isAllowed && refresh !== 1)
      return (
        <button className={`buttons ${s.login}`} id={s.active}>
          Confirm code
        </button>
      );
    else if (isPending)
      return (
        <p className="buttons" id={s.waiting}>
          Confirming code...
        </p>
      );
    else
      return (
        <p className="buttons" id={s.waiting}>
          Confirm code
        </p>
      );
  };

  return (
    <div className={s.forgotPsw}>
      <div className={s.card}>
        <form onSubmit={handleSubmit}>
          <h1 className={s.title}>Confirm your code</h1>
          <div className={s.info}>
            <label className={s.mail}>Confirmation code:</label>
            <input
              className={s.input}
              type="text"
              value={code}
              placeholder="Confirmation code"
              onChange={(e) => setCode(e.target.value)}
            />
            <div id="button-handler">{handleButton()}</div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfirmCode;