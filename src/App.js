import Header from "./Header";
import Keypad from "./Keypad";
import "./App.css";
import { useState,useEffect } from "react";
const App = () => {
  const useKeyCodes = [
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103,
    104, 105, 8, 13, 190, 197, 189, 191, 56, 111, 106, 107, 109,
  ];
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const operators = ["-", "+", "*", "/", ".", "%"];
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

useEffect(()=>{
  console.log("first")
},[result])

  const handleKeyPress = (keyCode, key) => {
    if (!keyCode) {
      return;
    }

    if (!useKeyCodes.includes(keyCode)) {
      return;
    }

    if (numbers.includes(key)) {
      if (key === "0") {
        if (expression.length == 1) {
          if (expression[0] == 0) {
            return;
          }
        }
        if (
          expression[expression.length - 1] == 0 &&
          operators.includes(expression[expression.length - 2]) &&
          expression[expression.length - 2] != "."
          ) {
            return;
          }
        }
        if(expression[expression.length-1] === "%" && numbers.includes(key) )return
      if (expression.length == 1 && expression[0] == 0) {
        return;
      }
      if (
        expression[expression.length - 1] == 0 &&
        operators.includes(expression[expression.length - 2]) &&
        expression[expression.length - 2] != "."
      ) {
        return;
      }
      calculateResult(expression + key);
      setExpression(expression + key);
    } else if (key == ".") {
      if (!expression) {
        return;
      }
      if (!numbers.includes(expression.slice(-1))) {
        return;
      }
      for (let i = expression.length - 1; i >= 0; i--) {
        if (operators.includes(expression[i])) {
          if (expression[i] == ".") {
            return;
          } else {
            break;
          }
        }
      }
      setExpression(expression + key);
    } else if (operators.includes(key)) {
      if (!expression) {
        return;
      }
      const lastChar = expression.slice(-1);

      if (operators.includes(lastChar) && lastChar !== "%") {
        return;
      }
      setExpression(expression + key);
    } else if (keyCode === 8) {
      if (expression.length == 0) {
        setResult("");
        setExpression("");
        return;
      }

      calculateResult(expression.slice(0, -1));
      setExpression(expression.slice(0, -1));
    } else if (key === 53) {
      if (!expression) {
        return;
      }
      const lastChar = expression.slice(-1);
      if (operators.includes(lastChar)) {
        return;
      }
      const percentage = eval(expression) / 100;
      setExpression(percentage.toString());
    }
    if (keyCode === 13) {
      if (!expression) {
        return;
      }
      calculateResult(expression);
      // setExpression(result);
      // setResult(result);
    }
  };

  const handlePercent = (exp) => {
    let index = [];
    let tempArry = "";
    for (let i = 0; i < exp.length; i++) {
      tempArry += exp[i];
      if (exp[i] == "%") {
        index.push(tempArry);
        tempArry = "";
      }
    }
    if (tempArry !== "") index.push(tempArry);
    let tempResult = 0;
    let remainStr = "";
    let continueExpression = "";
    for (let i = 0; i < index.length; i++) {
      let firstExpression = index[i];
      let Operator = "";
      let count = 0;
      if (firstExpression[firstExpression.length - 1] === "%") {
        let percentNumber = "";
        for (let j = firstExpression.length - 2; j >= 0; j--) {
          if (
            operators.includes(firstExpression[j]) &&
            firstExpression[j] !== "."
          ) {
            count++;
            if (count === 1) {
              Operator = firstExpression[j];
              continue;
            }
          }
          if (count === 0) {
            percentNumber += firstExpression[j];
          } else {
            remainStr += firstExpression[j];
          }
        }
        if (count == 0) {
          percentNumber = [...percentNumber].reverse().join("");
          continueExpression = (percentNumber / 100).toString();
          continue;
        } else {
          percentNumber = [...percentNumber].reverse().join("");
          continueExpression += [...remainStr].reverse().join("");
          continueExpression = eval(continueExpression);
          tempResult = (continueExpression * percentNumber) / 100;
          tempResult = tempResult.toString();
          if (Operator === "*") {
            continueExpression = tempResult;
          } else {
            tempResult = eval(
              continueExpression
                .toString()
                .concat(Operator)
                .concat(tempResult.toString())
            );
            continueExpression = tempResult.toString();
          }
          remainStr = "";
        }
      } else {
        remainStr += firstExpression;
      }
    }
    setResult(eval(continueExpression.concat(remainStr)).toString());
    setExpression(eval(continueExpression.concat(remainStr)).toString());
  };

  const calculateResult = (exp) => {
    if (!exp) {
      setResult("");
      return;
    }
    if ([...exp].includes("%")) {
      handlePercent(exp);
      return;
    }
    if (!numbers.includes(exp.slice(-1))) {
      exp = exp.slice(0, -1);
    }
    if (isNaN(eval(exp))) {
      setResult("Error");
      return;
    } else {
      setResult(eval(exp) + "");
    }
  };

  const handleclear = () => {
    setExpression("");
    setResult("");
  };
  return (
    <div
      className="app"
      tabIndex="0"
      onKeyDown={(e) => handleKeyPress(e.keyCode, e.key)}
    >
      <div className="app_calculator">
        <Header expression={expression} result={result} />
        <Keypad handleKeyPress={handleKeyPress} handleclear={handleclear} />
      </div>
    </div>
  );
};
export default App;
