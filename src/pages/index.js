import { css } from "@emotion/css";
import { useEffect, useRef, useState } from "react";

export default function CalculatorApp() {
  const [buttonR, setButtonR] = useState(0);
  const [calR, setCalR] = useState("");
  const [result, setResult] = useState(0);
  const [reset, setReset] = useState(false);
  const [history, setHistory] = useState([]);
  const [calDone, setCalDone] = useState(false);
  const [opers, setOpers] = useState(false);
  const [sign, setSign] = useState(false);
  useEffect(() => {
    setResult(buttonR);
  }, [buttonR]);

  const SignButton = () => {
    return (
      <>
        <input
          type="button"
          onClick={() => {
            if (!sign) {
              setButtonR(`(-${buttonR})`);
              setSign(!sign);
              console.log("buttonR :", buttonR);
              return;
            } else if (sign) {
              setButtonR(buttonR.replace(/[-()]/g, ""));
              setSign(!sign);
              console.log("buttonR :", buttonR);
              return;
            }
          }}
          value="+/-"
        />
      </>
    );
  };

  // 숫자 버튼

  const NumButton = ({ Num }) => {
    return (
      <>
        <input
          className="num"
          type="button"
          value={Num}
          onClick={() => {
            const lastCalR = calR.slice(-1);
            if (!calDone) {
              if (!reset && !isNaN(lastCalR) && buttonR !== 0) {
                setButtonR(buttonR + Num);
              } else if (opers && reset && isNaN(lastCalR)) {
                setButtonR(Num);
                setReset(false);
                setOpers(false);
              } else if (!opers && !reset && isNaN(lastCalR)) {
                setButtonR(result + Num);
              } else if (buttonR === 0 && Num !== ".") {
                setButtonR(Num);
                setReset(false);
              } else if (reset && !opers) {
                setButtonR(Num);
              } else if (!reset) {
                setButtonR(result + Num);
              } else if (buttonR == 0 && Num === ".") {
                setButtonR(result + Num);
              } else {
                setButtonR(Num);
                setOpers(false);
              }
            } else if (calDone) {
              setButtonR(Num);
              setReset(false);
              setCalDone(!calDone);
            }
          }}
        />
      </>
    );
  };
  // 계산 버튼
  const OperButton = ({ oper }) => {
    return (
      <>
        <input
          className="oper"
          type="button"
          onClick={() => {
            if (opers && isNaN(calR.slice(-1))) {
              setCalR(calR.slice(0, calR.length - 1) + oper);
              setReset(true);
            } else if (calR === "") {
              setCalR(buttonR + oper);
              setOpers(true);
              setReset(true);
            } else if (calR === "" && reset) {
              setCalR(buttonR + oper);
              setOpers(true);
              setReset(false);
            } else if (!opers && !reset && isNaN(calR.slice(-1))) {
              const nums = Number(eval(calR + result).toFixed(7));
              setCalR(`(${calR + buttonR})` + oper);
              setResult(nums);
              setReset(true);
              setOpers(true);
            } else if (!opers && !reset && !isNaN(calR.slice(-1))) {
            } else if (reset && !opers) {
            }
          }}
          value={oper}
        />
      </>
    );
  };

  const History = () => {
    const historys = {
      process: calR + buttonR + "=",
      result: Number(eval(calR + buttonR).toFixed(7)),
    };
    setHistory([historys, ...history]);
    setCalDone(!calDone);
  };
  // "="버튼
  const ResultButton = () => {
    return (
      <>
        <input
          className="resultBtn"
          type="button"
          value="="
          onClick={() => {
            if (calR !== "") {
              setCalR("");
              setResult(Number(eval(calR + buttonR).toFixed(7)));
              setButtonR(Number(eval(calR + buttonR).toFixed(7)));
              History();
              setReset(true);
            } else if (history.length !== 0 && calR === "" && buttonR !== 0) {
              console.log("history :", history);
              const lastCal = history[0].process;
              const cal = lastCal.slice(0, lastCal.length - 1);
              for (let i = cal.length - 1; i >= 0; i--) {
                if (isNaN(cal[i]) && cal[i] !== ".") {
                  const resultCal = cal.slice(i, cal.length);
                  const History2 = () => {
                    const historys = {
                      process: result + resultCal + "=",
                      result: Number(eval(result + resultCal).toFixed(7)),
                    };
                    setHistory([historys, ...history]);
                    setCalDone(!calDone);
                  };

                  setResult(Number(eval(result + resultCal).toFixed(7)));
                  History2();

                  return;
                }
              }
            } else if (calR === "") {
              return result;
            }
          }}
        />
      </>
    );
  };

  // "<" = buttonResult 하나씩 지움, "CE" 하나씩 지움, "C" 모두 지움
  const CancelButton = ({ btn }) => {
    return (
      <>
        <input
          className="oper"
          type="button"
          onClick={() => {
            if (btn === "<" && buttonR !== 0 && buttonR !== "") {
              const cancel = buttonR.slice(0, buttonR.length - 1);
              if (cancel === "") {
                setButtonR(0);
              } else if (cancel !== "") {
                setButtonR(cancel);
              }
            } else if (btn === "<" && buttonR === 0) {
              return;
            } else if (btn === "CE") {
              setButtonR(0);
              setReset(true);
            } else if (btn === "C") {
              setButtonR(0);
              setCalR("");
              setReset(false);
            }
          }}
          value={btn}
        />
      </>
    );
  };
  return (
    <>
      <div
        id="allCon"
        className={css`
          display: flex;
          justify-content: space-between;
          background-color: #f3f3f3;
          text-align: right;
          max-width: 680px;
          min-width: 680px;
          #historyCon {
            position: relative;
          }

          #history {
            display: flex;
            flex-direction: column;
            overflow: scroll;
            width: 320px;
            height: 530px;
            box-sizing: border-box;
            margin-right: 10px;
            margin-top: 10px;

            .clean {
              position: absolute;
              bottom: 10px;
              right: 10px;
              input {
                width: 100px;
                height: 30px;
                border-radius: 5px;
                background-color: #025a9e;
                color: white;
                border: 1px solid black;
                font-size: 15px;
                opacity: 0.3;
              }
              input:hover {
                width: 100px;
                height: 30px;
                border-radius: 5px;
                background-color: #025a9e;
                color: white;
                border: none;
                font-size: 15px;
                opacity: 1;
              }
            }

            &::-webkit-scrollbar {
              display: none;
            }

            p.process {
              margin: 5px 5px;
            }
            p.result {
              font-weight: 600;
              font-size: 1.5rem;
              margin: 0;
              margin-bottom: 20px;
            }
          }
        `}
      >
        <div
          id="cal-container"
          className={css`
            display: flex;
            flex-direction: column;
            border-collapse: none;
            min-width: 340px;
            width: 340px;
            height: 530px;
            border: 0.5px solid #cccccc;
            background-color: #f3f3f3;
            font-size: medium;
            box-sizing: border-box;
          `}
        >
          <div
            id="cal-result"
            className={css`
              width: 100%;
              height: 10.8125rem;
              display: flex;
              flex-direction: column-reverse;

              div {
                div {
                  display: flex;
                  width: 100%;
                  flex-direction: column-reverse;

                  input {
                    text-align: right;
                    border: none;
                    background-color: #f3f3f3;
                  }
                }
                #buttonResult {
                  width: 100%;
                  box-sizing: border-box;
                  border-right: none;
                  border-left: none;
                  border: 2px solid black;
                  height: 4.625rem;
                  text-align: right;
                  font-size: 45px;
                  padding-right: 10px;
                }
              }
            `}
          >
            <div>
              <div>
                <input
                  id="calProcess"
                  type="text"
                  value={calR.replace(/[()]/g, "")}
                  onChange={() => {}}
                />
              </div>
              <input
                id="buttonResult"
                type="text"
                value={String(result).replace(/[()]/g, "")}
                onChange={() => {}}
              />
            </div>
          </div>

          <div
            className={css`
              width: 100%;
              height: 22.125rem;
              display: flex;
              flex-direction: column-reverse;
            `}
          >
            <div
              id="cal-buttons"
              className={css`
                width: 100%;
                height: 20rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                border-right: none;
                border-left: none;

                div {
                  width: 100%;
                  display: flex;
                  justify-content: space-around;
                  .num {
                    background-color: white;
                  }
                  .oper {
                    background-color: #f9f9f9;
                  }
                  .resultBtn {
                    background-color: #025a9e;
                    color: white;
                  }

                  input {
                    width: 24%;
                    height: 3.125rem;
                    font-size: 20px;
                    font-weight: lighter;
                    border: 1px solid #cccccc;
                    box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
                    border-radius: 3px;
                  }
                }
              `}
            >
              <div className="buttons">
                <OperButton oper={"%"} />
                <CancelButton btn={"CE"} />
                <CancelButton btn={"C"} />
                <CancelButton btn={"<"} />
              </div>

              <div className="buttons">
                <OperButton oper={"1/x"} />
                <OperButton oper={"x2"} />
                <OperButton oper={"/x"} />
                <OperButton oper={"/"} />
              </div>
              <div className="buttons">
                <NumButton Num={"7"} />
                <NumButton Num={"8"} />
                <NumButton Num={"9"} />
                <OperButton oper={"*"} />
              </div>
              <div className="buttons">
                <NumButton Num={"4"} />
                <NumButton Num={"5"} />
                <NumButton Num={"6"} />
                <OperButton oper={"-"} />
              </div>
              <div className="buttons">
                <NumButton Num={"1"} />
                <NumButton Num={"2"} />
                <NumButton Num={"3"} />
                <OperButton oper={"+"} />
              </div>
              <div className="buttons">
                <SignButton />
                <NumButton Num={"0"} />
                <NumButton Num={"."} />
                <ResultButton result={"="} />
              </div>
            </div>
          </div>
        </div>
        <div
          id="historyCon"
          className={css`
            max-height: 530px;
          `}
        >
          <div id="history">
            {history.map((h, index) => {
              const pro = h.process.replace(/[()]/g, "");
              return (
                <div key={index}>
                  <p className="process">{pro}</p>
                  <p className="result">{h.result}</p>
                </div>
              );
            })}
            {history ? (
              <>
                <div className="clean">
                  <input
                    type="button"
                    onClick={() => {
                      setHistory([]);
                    }}
                    value="CLEAN"
                  />
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
