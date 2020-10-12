/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-compare-neg-zero */
/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BgColors, BorderColors, Spacings, TextColors } from '@styles/index';
import H4 from '@base/H4/H4';
import RadioButton from '@base/RadioButton/RadioButton';
import imageHelper from '@utils/imageHelper';
import { useState } from 'react';
import P1 from '@base/P1/P1';
import {
  cosCalc,
  cosInvCalc,
  factorial,
  inverseSineH,
  nthroot,
  sinCalc,
  sinInvCalc,
  tanCalc,
  tanInvCalc,
} from './helper';

const strEmpty = '0';
const strMathError = 'Math Error';
const strInf = 'Infinity';
let boolClear = true;
let stackVal1 = 1;
let stackVal2 = 0;
let stackVal = 0;
let oscError;
let trigDisplay = '';
let displayString = '';
let opCodeArray = [];
let stackArray = [];
let opCode = 0;
let memory = 0;
let trig = 0;
let newOpCode = 0;
let openArray = [];
const maxLength = 8;

const BackSpace = styled.img`
  height: 0.8rem;
`;

const Wrapper = styled.div`
  background-color: ${BgColors.DISABLED};
  padding: ${Spacings.SPACING_4B};
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  & > :not(:last-child) {
    margin-bottom: ${Spacings.SPACING_2B};
  }
`;

const RadioWrapper = styled.div`
  display: flex;
  grid-area: radio;
`;

const RadioLabel = styled(P1)`
  font-size: 0.54rem;
`;

const Radio = styled(RadioButton)`
  padding-right: 0px;
  margin-right: ${Spacings.SPACING_2B};
  :hover {
    background-color: ${BgColors.GREY};
  }
`;

const Button = styled.button`
  border: none;
  cursor: pointer;
  background-color: ${BgColors.WHITE};
  color: ${TextColors.BLACK};
  flex: 1 1 ${({ $isScientific }) => ($isScientific ? '11.9' : '16')}%;
  font-size: ${({ $isScientific }) => ($isScientific ? '0.64rem' : '1.6rem')};
  margin: ${Spacings.SPACING_1B};
  border-radius: ${Spacings.SPACING_1B};
  &:active {
    background-color: ${BgColors.DISABLED};
  }
`;

const BackSpaceButton = styled(Button)`
  grid-area: backSpace;
  background-color: ${BgColors.LIVE};
  flex: 1;
  margin: 0px;
  &:active {
    background-color: ${BgColors.DARK_RED};
  }
`;

const RedButton = styled(BackSpaceButton)`
  color: ${TextColors.WHITE};
  margin: ${Spacings.SPACING_1B};
`;

const ClearWhiteButtons = styled(BackSpaceButton)`
  margin: ${Spacings.SPACING_1B};
  background-color: ${BgColors.WHITE};
  &:active {
    background-color: ${BgColors.DISABLED};
  }
`;

const DecimalButton = styled(Button)`
  color: black;
  background-color: white;
`;

const Zero = styled(Button)`
  background-color: white;
  color: black;
  grid-area: zero;
  flex: 1;
  margin: 0px;
`;

const Equal = styled(RedButton)`
  grid-area: equal;
  margin: 0px;
  background-color: ${BgColors.GREEN};
  &:active {
    background-color: ${BgColors.DARK_GREEN};
  }
`;

const Input = styled.div`
  background-color: ${BgColors.WHITE};
  border: 1px solid ${BorderColors.BLUE};
  height: ${Spacings.SPACING_8B};
  border-radius: ${Spacings.SPACING_1B};
  padding: 0px 10px;
  overflow: hidden;
  text-align: end;
  flex-grow: 1;
`;

const ButtonArea = styled.div`
  flex-grow: 8;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(6, 1fr);
  row-gap: ${Spacings.SPACING_2B};
  column-gap: ${Spacings.SPACING_2B};
  justify-items: stretch;
  grid-template-areas:
    'memory memory memory memory memory'
    'backSpace backSpace clear clear clear'
    'fire fire fire fire fire'
    'fire fire fire fire fire'
    'num num num num equal'
    'zero zero decimal decimal equal';
`;

const ScientificArea = styled(ButtonArea)`
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(9, 1fr);
  grid-template-areas:
    'radio radio memory memory memory memory memory'
    'backSpace backSpace clear clear clear clear clear'
    'fire fire fire fire fire fire fire'
    'fire fire fire fire fire fire fire'
    'fire fire fire fire fire fire fire'
    'zero zero decimal decimal decimal decimal decimal'
    'num num num num num num num'
    'trigo trigo trigo trigo trigo trigo equal'
    'log log log log log log equal';
`;

const Num = styled.div`
  grid-area: num;
  display: flex;
  margin: -${Spacings.SPACING_1B};
`;

const Fire = styled(Num)`
  grid-area: fire;
  flex-wrap: wrap;
`;

const Memory = styled(Num)`
  grid-area: memory;
`;

const Clear = styled(Num)`
  grid-area: clear;
`;

const Log = styled(Num)`
  grid-area: log;
`;

const Trigo = styled(Num)`
  grid-area: trigo;
`;

const Decimal = styled(Num)`
  grid-area: decimal;
`;

const M = styled.div`
  font-size: 0.64rem;
`;

const displayTrignometric = (text, x) => {
  if (stackVal2 == 1) {
    let string = '';
    for (let i = openArray.length; i >= 0; i -= 1) {
      string += displayString.substring(0, displayString.lastIndexOf('(') + 1);
      displayString = displayString.replace(string, '');
    }
    displayString = string.substring(0, string.lastIndexOf('('));
    trigDisplay = `${text}(${x})`;
  }
  if (stackVal2 == 2 || stackVal1 == 3) {
    if (stackVal2 == 3) {
      trigDisplay = `${text}(${x})`;
      stackVal2 = 2;
    } else {
      displayString = displayString.replace(trigDisplay, '');
      trigDisplay = `${text}(${trigDisplay})`;
    }
  } else {
    if (stackVal2 == 4) displayString = '';
    trigDisplay = `${text}(${x})`;
  }
  displayString += trigDisplay;
};

const Calculator = ({ isScientific, className }) => {
  const [inBox1, setInbox1] = useState('');
  const [inBox, setInbox] = useState('0');
  const [showMem, setShowMem] = useState(false);
  const [modeSelected, setModSelected] = useState('deg');
  const ButtonWrapper = isScientific ? ScientificArea : ButtonArea;

  const displayCheck = () => {
    switch (stackVal1) {
      case 2:
        setInbox1('');
        break;
      case 3:
        setInbox1(
          toString(inBox1).substring(
            0,
            toString(inBox1).length - trigDisplay.length
          )
        );
        stackVal2 = 4;
        break;
      case 5: {
        let string = '';
        for (let i = openArray.length; i >= 0; i -= 1) {
          string += displayString.substring(0, displayString.indexOf('(') + 1);
          displayString = displayString.replace(string, '');
        }
        displayString = string.substring(0, string.lastIndexOf('('));
        setInbox1(displayString);
        stackVal2 = 6;
        break;
      }
      default:
        break;
    }
  };

  const handleNum = (e) => {
    const btnVal = e.target.value;
    if (
      toString(inBox).indexOf(strInf) > -1 ||
      toString(inBox).indexOf(strMathError) > -1
    )
      return;
    const str = boolClear ? strEmpty : inBox;
    if (boolClear) {
      setInbox(strEmpty);
      boolClear = false;
    }
    if (str.length > maxLength) return;
    if (btnVal == '.' && str.indexOf('.') >= 0 && inBox1 != '') {
      setInbox(`${strEmpty}.`);
      setInbox1('');
      return;
    }
    if (btnVal == '.' && str.indexOf('.') >= 0) return;
    displayCheck();
    if (str != strEmpty || str.length > 1 || btnVal == '.') {
      setInbox(str + btnVal);
      stackVal1 = 1;
    } else {
      setInbox(btnVal);
      stackVal1 = 1;
    }
  };

  const oscBinaryOperation = () => {
    const x2 = parseFloat(inBox);
    let retVal = 0;
    switch (opCode) {
      case 9:
        stackVal = parseFloat(stackVal) * 10 ** x2;
        break;
      case 1:
        stackVal += x2;
        break;
      case 2:
        stackVal -= x2;
        break;
      case 3:
        stackVal *= x2;
        break;
      case 4:
        stackVal /= x2;
        break;
      case 6: {
        const precisioncheck = stackVal;
        stackVal **= x2;
        if (
          precisioncheck == 10 &&
          stackVal % 10 != 0 &&
          (Math.abs(stackVal) < 0.00000001 || Math.abs(stackVal) > 100000000) &&
          x2 % 1 == 0
        )
          stackVal = stackVal.toPrecision(7);
        break;
      }
      case 5:
        stackVal %= x2;
        break;
      case 7:
        stackVal = nthroot(stackVal, x2);
        break;
      case 8:
        stackVal = Math.log(stackVal) / Math.log(x2);
        break;
      case 11:
        stackVal = (stackVal / 100) * x2;
        break;
      case 0:
        stackVal = x2;
        break;
      default:
        break;
    }
    retVal = stackVal;
    if (Math.abs(retVal) < 0.00000001 || Math.abs(retVal) > 100000000) {
      // do nothing
    } else if (retVal.toFixed(8) % 1 != 0) {
      let i = 1;
      while (i < 10) {
        if (
          retVal.toFixed(i) != 0 &&
          retVal.toFixed(i) / retVal.toFixed(i + 8) == 1
        ) {
          retVal = retVal.toFixed(i);
          break;
        } else i += 1;
      }
    } else retVal = retVal.toFixed(0);
    setInbox(retVal);
    boolClear = true;
    trig = 0;
  };

  const handleButtonCommand = (e) => {
    let strInput = inBox;
    let variable = inBox1;
    switch (e.target.value) {
      case 'equal':
        if (
          toString(inBox).indexOf(strInf) > -1 ||
          toString(inBox).indexOf(strMathError) > -1
        )
          return;
        while (opCode || opCodeArray[0]) {
          if (stackArray[stackArray.length - 1] == '{') {
            stackArray.pop();
          }
          oscBinaryOperation();
          stackVal = stackArray[stackArray.length - 1];
          opCode = opCodeArray[opCodeArray.length - 1];
          stackArray.pop();
          opCodeArray.pop();
        }
        opCode = 0;
        displayString = '';
        trigDisplay = '';
        stackVal = strEmpty;
        openArray = [];
        if (stackVal1 != 2) {
          if (stackVal1 == 3 || stackVal2 == 1)
            if (stackVal2 != 3) strInput = '';
          if (newOpCode == 9) {
            if (strInput.indexOf('-') > -1) {
              variable = toString(inBox1).substring(
                0,
                toString(inBox1).lastIndexOf('+')
              );
              setInbox1(variable);
            } else {
              variable = toString(inBox1).replace('e+0', 'e+');
              setInbox1(variable);
            }
          }
          setInbox1(variable + strInput);
        }
        stackVal1 = 2;
        newOpCode = 0;
        stackVal2 = 0;
        stackArray = [];
        opCodeArray = [];
        return;
      case 'backSpace':
        if (stackVal1 == 1 || stackVal2 == 3) {
          if (strInput.length > 1) {
            if (
              toString(inBox).indexOf(strInf) > -1 ||
              toString(inBox).indexOf(strMathError) > -1
            )
              return;
            variable = strInput.substring(0, strInput.length - 1);
            setInbox(variable);
            if (variable == '-') setInbox('0');
            break;
          } else {
            setInbox('0');
            break;
          }
        } else break;
      case 'clear':
        setInbox(strEmpty);
        displayString = '';
        trigDisplay = '';
        stackArray = [];
        opCodeArray = [];
        openArray = [];
        setInbox1('');
        stackVal = strEmpty;
        stackVal1 = 1;
        stackVal2 = 0;
        newOpCode = 0;
        opCode = 0;
        break;
      default:
        break;
    }
  };

  const modeText = (text, x) => {
    let mode = 'd';
    if (modeSelected != 'deg') mode = 'r';
    displayTrignometric(text + mode, x);
  };

  const handleUnaryOp = (e) => {
    const x = parseFloat(inBox);
    let retVal = oscError;
    if (
      toString(inBox).indexOf(strInf) > -1 ||
      toString(inBox).indexOf(strMathError) > -1
    )
      return;
    switch (e.target.value) {
      // +/-
      case 'negate':
        retVal = -x;
        trig = 1;
        stackVal2 = 3;
        break;
      // 1/X
      case 'reciproc':
        retVal = 1 / x;
        displayTrignometric('reciproc', x);
        break;
      // X^2
      case 'sqr':
        retVal = x * x;
        displayTrignometric('sqr', x);
        break;
      // SQRT(X)
      case 'sqrt':
        retVal = Math.sqrt(x);
        displayTrignometric('sqrt', x);
        break;
      // X^3
      case 'cube':
        retVal = x * x * x;
        displayTrignometric('cube', x);
        break;
      // POW (X, 1/3)
      case 'cubeRoot':
        retVal = nthroot(x, 3);
        displayTrignometric('cuberoot', x);
        break;
      // NATURAL LOG
      case 'ln':
        retVal = Math.log(x);
        displayTrignometric('ln', x);
        break;
      // LOG BASE 10
      case 'log':
        retVal = Math.log(x) / Math.LN10;
        displayTrignometric('log', x);
        break;
      // E^(X)
      case 'epowx':
        retVal = Math.exp(x);
        displayTrignometric('powe', x);
        break;
      // SIN
      case 'sin':
        retVal = sinCalc(modeSelected, x);
        modeText('sin', x);
        trig = 1;
        break;
      // COS
      case 'cos':
        retVal = cosCalc(modeSelected, x);
        modeText('cos', x);
        trig = 1;
        break;
      // TAN
      case 'tan':
        retVal = tanCalc(modeSelected, x);
        modeText('tan', x);
        trig = 1;
        break;
      // Factorial
      case 'fact':
        retVal = factorial(x);
        displayTrignometric('fact', x);
        break;

      // 10^x
      case '10PowX':
        retVal = 10 ** x;
        if (
          retVal % 10 != 0 &&
          (Math.abs(retVal) < 0.00000001 || Math.abs(retVal) > 100000000) &&
          x % 1 == 0
        )
          retVal = retVal.toPrecision(7);
        displayTrignometric('powten', x);
        break;

      case 'sinhInv':
        retVal = inverseSineH(x);
        modeText('sinh-1', x);
        break;

      // AcosH
      case 'coshInv':
        retVal = Math.log(x + Math.sqrt(x + 1) * Math.sqrt(x - 1));
        modeText('cosh-1', x);
        break;

      // AtanH
      case 'tanhInv':
        retVal = 0.5 * (Math.log(1 + x) - Math.log(1 - x));
        modeText('tanh-1', x);
        break;

      // Absolute |x|
      case 'abs':
        retVal = Math.abs(x);
        displayTrignometric('abs', x);
        break;

      // Log Base 2
      case 'logBase2':
        retVal = Math.log(x) / Math.log(2);
        displayTrignometric('logXbase2', x);
        break;

      // Arcsin
      case 'sinInv':
        retVal = sinInvCalc(modeSelected, x);
        modeText('asin', x);
        trig = 1;
        break;
      // Arccos
      case 'cosInv':
        retVal = cosInvCalc(modeSelected, x);
        modeText('acos', x);
        trig = 1;
        break;
      // Arctag
      case 'tanInv':
        retVal = tanInvCalc(modeSelected, x);
        modeText('atan', x);
        trig = 1;
        break;

      // sinh
      case 'sinh':
        retVal = (Math.E ** x - Math.E ** -x) / 2;
        modeText('sinh', x);
        break;
      // cosh
      case 'cosh':
        retVal = (Math.E ** x + Math.E ** -x) / 2;
        modeText('cosh', x);
        break;
      // coth
      case 'tanh':
        retVal = Math.E ** x - Math.E ** -x;
        retVal /= Math.E ** x + Math.E ** -x;
        modeText('tanh', x);
        break;
      default:
        break;
    }

    if (stackVal2 == 1) {
      stackVal = retVal;
    }
    if (stackVal2 != 3) {
      stackVal2 = 2;
    }
    stackVal1 = 3;
    boolClear = true;
    if (retVal == 0 || retVal == strMathError || retVal == strInf)
      setInbox(retVal);
    else if (
      (Math.abs(retVal) < 0.00000001 || Math.abs(retVal) > 100000000) &&
      trig != 1
    ) {
      // do nothing
    } else if (retVal.toFixed(8) % 1 != 0) {
      let i = 1;
      while (i < 10) {
        if (
          retVal.toFixed(i) != 0 &&
          retVal.toFixed(i) / retVal.toFixed(i + 8) == 1
        ) {
          retVal = retVal.toFixed(i);
          break;
        } else {
          i += 1;
        }
      }
    } else retVal = retVal.toFixed(0);
    if (retVal == -0) retVal = 0;
    setInbox(retVal);
    trig = 0;
    setInbox1(displayString);
  };

  const stackCheck = (text) => {
    let variable;
    if (stackVal1 == 2) setInbox1('');
    if (stackVal1 == 0) {
      opCode = 0;
      let x = 1;
      switch (newOpCode) {
        case 5:
          x = 3;
          break;
        case 7:
          x = 5;
          break;
        case 8:
          x = 9;
          break;
        default:
          break;
      }
      if (!(toString(inBox1).indexOf('e+') > -1)) {
        variable = toString(inBox1).substring(0, toString(inBox1).length - x);
        setInbox1(variable);
      }
      stackVal2 = 2;
    }
    if (stackVal1 == 5 || stackVal2 == 2) {
      stackVal2 = 0;
      displayString = (variable || inBox1) + text.trim();
    } else {
      if (
        toString(variable || inBox1).indexOf('e+0') > -1 &&
        toString(variable || inBox1).indexOf('-') > -1
      )
        setInbox1(toString(variable || inBox1).replace('e+0', 'e'));
      else if (toString(variable || inBox1).indexOf('e+0') > -1)
        setInbox1(toString(variable || inBox1).replace('e+0', 'e+'));
      displayString = variable || inBox1 + inBox + text.trim();
    }
  };

  const opcodeChange = () => {
    if (opCode != 10 && opCode != 0) {
      opCodeArray.push(opCode);
      stackArray.push(stackVal);
    }
    if (opCode == 0) stackArray.push(stackVal);
    opCode = 0;
  };

  const operation = () => {
    while (opCodeArray[0] && opCode) {
      if (opCode == 10) {
        opCode = opCodeArray[opCodeArray.length - 1];
        stackVal = stackArray[stackArray.length - 1];
        if (newOpCode == 1 || newOpCode == 2 || newOpCode <= opCode) {
          opCodeArray.pop();
          stackArray.pop();
        } else {
          opCode = 0;
          break;
        }
      } else if (stackArray[stackArray.length - 1] == '{') break;
      else {
        oscBinaryOperation();
        stackVal = stackArray[stackArray.length - 1];
        if (stackVal == '{') {
          opCode = 0;
          break;
        }
        opCode = opCodeArray[opCodeArray.length - 1];
        if (newOpCode == 1 || newOpCode == 2 || newOpCode <= opCode) {
          opCodeArray.pop();
          stackArray.pop();
        } else {
          opCode = 0;
          break;
        }
        if (
          !opCodeArray[0] &&
          stackArray.length > 0 &&
          stackArray[stackArray.length - 1] != '{'
        )
          stackVal = stackArray?.[stackArray.length - 1];
      }
    }
  };

  const handleBinaryOp = (e) => {
    if (
      toString(inBox).indexOf(strInf) > -1 ||
      toString(inBox).indexOf(strMathError) > -1
    )
      return;
    switch (e.target.value) {
      case '+':
        stackCheck('+');
        newOpCode = 1;
        if (
          opCode == 10 &&
          stackArray.length > 0 &&
          stackArray[stackArray.length - 1] == '{'
        )
          opcodeChange();
        operation();
        stackVal1 = 0;
        break;
      case '-':
        stackCheck('-');
        newOpCode = 2;
        if (
          opCode == 10 &&
          stackArray.length > 0 &&
          stackArray[stackArray.length - 1] == '{'
        )
          opcodeChange();
        operation();
        stackVal1 = 0;
        break;
      case '*':
        stackCheck('*');
        newOpCode = 3;
        if (opCode == 1 || opCode == 2) opcodeChange();
        if (opCode == 10) {
          if (
            opCodeArray[opCodeArray.length - 1] < 3 ||
            (stackArray.length > 0 && stackArray[stackArray.length - 1] == '{')
          )
            opcodeChange();
          else operation();
        }
        stackVal1 = 0;
        break;
      case '/':
        stackCheck('/');
        newOpCode = 4;
        if (opCode < 4 && opCode) opcodeChange();
        if (opCode == 10) {
          if (
            opCodeArray[opCodeArray.length - 1] < 4 ||
            stackVal1 == 5 ||
            (stackArray.length > 0 && stackArray[stackArray.length - 1] == '{')
          )
            opcodeChange();
          else operation();
        }
        stackVal1 = 0;
        break;
      case '%':
        stackCheck('%');
        newOpCode = 11;
        if (opCode < 6 && opCode) opcodeChange();
        if (opCode == 10) {
          if (
            opCodeArray[opCodeArray.length - 1] < 6 ||
            (stackArray.length > 0 && stackArray[stackArray.length - 1] == '{')
          )
            opcodeChange();
          else operation();
        }
        stackVal1 = 0;
        break;

      case 'exponential':
        stackCheck('e+0');
        newOpCode = 9;
        if (opCode < 6 && opCode) opcodeChange();
        if (opCode == 10) {
          if (
            opCodeArray[opCodeArray.length - 1] < 6 ||
            (stackArray.length > 0 && stackArray[stackArray.length - 1] == '{')
          )
            opcodeChange();
          else operation();
        }
        stackVal1 = 1;
        stackVal2 = 7;
        break;
      case '^':
        stackCheck('^');
        newOpCode = 6;
        if (opCode < 6 && opCode) opcodeChange();
        if (opCode == 10) {
          if (
            opCodeArray[opCodeArray.length - 1] < 6 ||
            (stackArray.length > 0 && stackArray[stackArray.length - 1] == '{')
          )
            opcodeChange();
          else operation();
        }
        stackVal1 = 0;
        break;
      case 'mod':
        stackCheck('mod');
        newOpCode = 5;
        if (opCode == 1 || opCode == 2) opcodeChange();
        if (opCode == 10) {
          if (
            opCodeArray[opCodeArray.length - 1] == 1 ||
            2 ||
            (stackArray.length > 0 && stackArray[stackArray.length - 1] == '{')
          )
            opcodeChange();
          else operation();
        }
        stackVal1 = 0;
        break;
      case 'yRootX':
        stackCheck('yroot');
        newOpCode = 7;
        if (opCode < 6 && opCode) opcodeChange();
        if (opCode == 10) {
          if (
            opCodeArray[opCodeArray.length - 1] < 6 ||
            (stackArray.length > 0 && stackArray[stackArray.length - 1] == '{')
          )
            opcodeChange();
          else operation();
        }
        stackVal1 = 0;
        break;
      case 'yLogX':
        stackCheck('logxBasey');
        newOpCode = 8;
        if (opCode == 1 || opCode == 2) opcodeChange();
        if (opCode == 10) {
          if (
            opCodeArray[opCodeArray.length - 1] < 3 ||
            (stackArray.length > 0 && stackArray[stackArray.length - 1] == '{')
          )
            opcodeChange();
          else operation();
        }
        stackVal1 = 0;
        break;
      case 'leftBracket':
        displayString = `${inBox1}(`;
        newOpCode = 0;
        setInbox('0');
        if (opCode != 0) opcodeChange();
        openArray.push('{');
        stackArray.push('{');
        stackVal1 = 1;
        break;
      case 'rightBracket':
        if (stackVal2 == 6) {
          stackVal = parseFloat(inBox);
          displayString = `${inBox1 + inBox})`;
        } else if (newOpCode != 10) {
          if (stackVal1 != 3) {
            if (
              toString(inBox1).indexOf('e+0') > -1 &&
              toString(inBox).indexOf('-') > -1
            )
              setInbox1(toString(inBox1).replace('e+0', 'e'));
            else if (toString(inBox1).indexOf('e+0') > -1)
              setInbox1(toString(inBox1).replace('e+0', 'e+'));
            displayString = `${inBox1 + inBox})`;
          } else displayString = `${inBox1})`;
        } else displayString = `${inBox1})`;
        if (openArray[0]) {
          openArray.pop();
          newOpCode = 10;
          while (opCodeArray[0] || openArray[0]) {
            if (stackArray[stackArray.length - 1] == '{') {
              stackArray.pop();
              break;
            } else {
              oscBinaryOperation();
              stackVal = stackArray[stackArray.length - 1];
              if (stackVal == '{') {
                stackArray.pop();
                opCode = 0;
                break;
              }
              stackArray.pop();
              opCode = opCodeArray[opCodeArray.length - 1];
              opCodeArray.pop();
              if (
                !opCodeArray[0] &&
                stackArray.length > 0 &&
                stackArray[stackArray.length - 1] != '{'
              )
                stackVal = stackArray?.[stackArray.length - 1];
            }
          }
        } else return;
        stackVal2 = 1;
        stackVal1 = 5;
        break;
      default:
        break;
    }
    if (opCode) oscBinaryOperation();
    else {
      stackVal = parseFloat(inBox);
      boolClear = true;
    }
    opCode = newOpCode;
    setInbox1(displayString);
  };

  const handleMemory = (e) => {
    let x = parseFloat(inBox);
    if (inBox == '') x = 0;
    let retVal = 0;
    if (
      toString(inBox).indexOf(strInf) > -1 ||
      toString(inBox).indexOf(strMathError) > -1
    )
      return;
    switch (e.target.value) {
      case 'MS':
        memory = x;
        setShowMem(true);
        retVal = inBox;
        break;
      case 'M+':
        memory = x + parseFloat(memory);
        setShowMem(true);
        retVal = inBox;
        break;
      case 'MR':
        retVal = parseFloat(memory);
        stackVal1 = 1;
        break;
      case 'MC':
        memory = 0;
        setShowMem(false);
        retVal = inBox;
        break;
      case 'M-':
        setShowMem(true);
        memory = parseFloat(memory) - x;
        retVal = inBox;
        break;
      default:
        break;
    }
    setInbox(retVal);
    boolClear = true;
  };

  return (
    <Wrapper className={className}>
      <Input>
        <H4>{inBox1}</H4>
      </Input>
      <Input>
        <H4>{inBox}</H4>
      </Input>
      <ButtonWrapper>
        {isScientific && (
          <RadioWrapper>
            <Radio
              label={<RadioLabel>Deg</RadioLabel>}
              checked={modeSelected === 'deg'}
              onChange={() => setModSelected('deg')}
            />
            <Radio
              label={<RadioLabel>Rad</RadioLabel>}
              checked={modeSelected === 'rad'}
              onChange={() => setModSelected('rad')}
            />
            {showMem && <M>M</M>}
          </RadioWrapper>
        )}
        <Memory>
          <ClearWhiteButtons
            $isScientific={isScientific}
            onClick={handleMemory}
            value="MC"
          >
            MC
          </ClearWhiteButtons>
          <ClearWhiteButtons
            $isScientific={isScientific}
            onClick={handleMemory}
            value="MR"
          >
            MR
          </ClearWhiteButtons>
          <ClearWhiteButtons
            $isScientific={isScientific}
            onClick={handleMemory}
            value="MS"
          >
            MS
          </ClearWhiteButtons>
          <ClearWhiteButtons
            $isScientific={isScientific}
            onClick={handleMemory}
            value="M+"
          >
            M+
          </ClearWhiteButtons>
          <ClearWhiteButtons
            $isScientific={isScientific}
            onClick={handleMemory}
            value="M-"
          >
            M-
          </ClearWhiteButtons>
        </Memory>
        <BackSpaceButton
          $isScientific={isScientific}
          onClick={handleButtonCommand}
          value="backSpace"
        >
          <BackSpace src={imageHelper.getImage('backSpace.svg')} />
        </BackSpaceButton>
        <Clear>
          <RedButton
            $isScientific={isScientific}
            onClick={handleButtonCommand}
            value="clear"
          >
            C
          </RedButton>
          <RedButton
            $isScientific={isScientific}
            value="negate"
            onClick={handleUnaryOp}
          >
            +/-
          </RedButton>
          <ClearWhiteButtons
            $isScientific={isScientific}
            value="sqrt"
            onClick={handleUnaryOp}
          >
            <BackSpace
              src={imageHelper.getImage('sqrRoot.svg')}
              alt="sqrRoot"
            />
          </ClearWhiteButtons>
          {isScientific && (
            <>
              <ClearWhiteButtons
                $isScientific={isScientific}
                value="leftBracket"
                onClick={handleBinaryOp}
              >
                (
              </ClearWhiteButtons>
              <ClearWhiteButtons
                $isScientific={isScientific}
                onClick={handleBinaryOp}
                value="rightBracket"
              >
                )
              </ClearWhiteButtons>
            </>
          )}
        </Clear>
        <Fire>
          <Button $isScientific={isScientific} value="7" onClick={handleNum}>
            7
          </Button>
          <Button $isScientific={isScientific} value="8" onClick={handleNum}>
            8
          </Button>
          <Button $isScientific={isScientific} value="9" onClick={handleNum}>
            9
          </Button>
          <Button
            $isScientific={isScientific}
            value="/"
            onClick={handleBinaryOp}
          >
            /
          </Button>
          <Button
            $isScientific={isScientific}
            value="%"
            onClick={handleBinaryOp}
          >
            %
          </Button>
          {isScientific && (
            <>
              <Button
                $isScientific={isScientific}
                value="10PowX"
                onClick={handleUnaryOp}
              >
                10
                <sup>x</sup>
              </Button>
              <Button
                $isScientific={isScientific}
                value="reciproc"
                onClick={handleUnaryOp}
              >
                1/x
              </Button>
            </>
          )}
          <Button $isScientific={isScientific} value="4" onClick={handleNum}>
            4
          </Button>
          <Button $isScientific={isScientific} value="5" onClick={handleNum}>
            5
          </Button>
          <Button $isScientific={isScientific} value="6" onClick={handleNum}>
            6
          </Button>
          <Button
            $isScientific={isScientific}
            value="*"
            onClick={handleBinaryOp}
          >
            *
          </Button>
          {!isScientific && (
            <Button
              $isScientific={isScientific}
              value="reciproc"
              onClick={handleUnaryOp}
            >
              1/x
            </Button>
          )}
          {isScientific && (
            <>
              <Button
                $isScientific={isScientific}
                value="cube"
                onClick={handleUnaryOp}
              >
                x<sup>3</sup>
              </Button>
              <Button
                $isScientific={isScientific}
                value="sqr"
                onClick={handleUnaryOp}
              >
                x<sup>2</sup>
              </Button>
              <Button $isScientific={isScientific} value="exp">
                e
              </Button>
              <Button
                $isScientific={isScientific}
                value="1"
                onClick={handleNum}
              >
                1
              </Button>
              <Button
                $isScientific={isScientific}
                value="2"
                onClick={handleNum}
              >
                2
              </Button>
              <Button
                $isScientific={isScientific}
                value="3"
                onClick={handleNum}
              >
                3
              </Button>
              <Button
                $isScientific={isScientific}
                value="-"
                onClick={handleBinaryOp}
              >
                -
              </Button>
              <Button
                $isScientific={isScientific}
                value="mod"
                onClick={handleBinaryOp}
              >
                mod
              </Button>
              <Button
                $isScientific={isScientific}
                value="abs"
                onClick={handleUnaryOp}
              >
                |x|
              </Button>
              <Button
                $isScientific={isScientific}
                value="epowx"
                onClick={handleUnaryOp}
              >
                e<sup>x</sup>
              </Button>
            </>
          )}
        </Fire>
        {!isScientific && (
          <Num>
            <DecimalButton
              $isScientific={isScientific}
              value="1"
              onClick={handleNum}
            >
              1
            </DecimalButton>
            <DecimalButton
              $isScientific={isScientific}
              value="2"
              onClick={handleNum}
            >
              2
            </DecimalButton>
            <DecimalButton
              $isScientific={isScientific}
              value="3"
              onClick={handleNum}
            >
              3
            </DecimalButton>
            <DecimalButton
              $isScientific={isScientific}
              value="-"
              onClick={handleBinaryOp}
            >
              -
            </DecimalButton>
          </Num>
        )}
        <Zero $isScientific={isScientific} value="0" onClick={handleNum}>
          0
        </Zero>
        <Decimal>
          <DecimalButton
            $isScientific={isScientific}
            onClick={handleNum}
            value="."
          >
            .
          </DecimalButton>
          <DecimalButton
            $isScientific={isScientific}
            value="+"
            onClick={handleBinaryOp}
          >
            +
          </DecimalButton>
          {isScientific && (
            <>
              <DecimalButton $isScientific={isScientific} value="pi">
                pie
              </DecimalButton>
              <DecimalButton
                $isScientific={isScientific}
                value="^"
                onClick={handleBinaryOp}
              >
                x<sup>y</sup>
              </DecimalButton>
              <DecimalButton
                $isScientific={isScientific}
                value="yRootX"
                onClick={handleBinaryOp}
              >
                <img src={imageHelper.getImage('yRootX.svg')} alt="yRootX" />
              </DecimalButton>
            </>
          )}
        </Decimal>
        {isScientific && (
          <>
            <Num>
              <Button
                $isScientific={isScientific}
                value="sin"
                onClick={handleUnaryOp}
              >
                sin
              </Button>
              <Button
                $isScientific={isScientific}
                value="cos"
                onClick={handleUnaryOp}
              >
                cos
              </Button>
              <Button
                $isScientific={isScientific}
                value="tan"
                onClick={handleUnaryOp}
              >
                tan
              </Button>
              <Button
                $isScientific={isScientific}
                value="fact"
                onClick={handleUnaryOp}
              >
                n!
              </Button>
              <Button
                $isScientific={isScientific}
                value="logBase2"
                onClick={handleUnaryOp}
              >
                log
                <sub>2</sub>x
              </Button>
              <Button
                $isScientific={isScientific}
                value="ln"
                onClick={handleUnaryOp}
              >
                ln
              </Button>
              <Button
                $isScientific={isScientific}
                value="log"
                onClick={handleUnaryOp}
              >
                log
              </Button>
            </Num>
            <Trigo>
              <Button
                $isScientific={isScientific}
                value="sinhInv"
                onClick={handleUnaryOp}
              >
                sinh
                <sup>-1</sup>
              </Button>
              <Button
                $isScientific={isScientific}
                value="coshInv"
                onClick={handleUnaryOp}
              >
                cosh
                <sup>-1</sup>
              </Button>
              <Button
                $isScientific={isScientific}
                value="tanhInv"
                onClick={handleUnaryOp}
              >
                tanh
                <sup>-1</sup>
              </Button>
              <Button
                $isScientific={isScientific}
                value="sinInv"
                onClick={handleUnaryOp}
              >
                sin
                <sup>-1</sup>
              </Button>
              <Button
                $isScientific={isScientific}
                value="cosInv"
                onClick={handleUnaryOp}
              >
                cos
                <sup>-1</sup>
              </Button>
              <Button
                $isScientific={isScientific}
                value="tanInv"
                onClick={handleUnaryOp}
              >
                tan
                <sup>-1</sup>
              </Button>
            </Trigo>
            <Log>
              <Button
                $isScientific={isScientific}
                value="sinh"
                onClick={handleUnaryOp}
              >
                sinh
              </Button>
              <Button
                $isScientific={isScientific}
                value="cosh"
                onClick={handleUnaryOp}
              >
                cosh
              </Button>
              <Button
                $isScientific={isScientific}
                value="tanh"
                onClick={handleUnaryOp}
              >
                tanh
              </Button>
              <Button
                $isScientific={isScientific}
                value="exponential"
                onClick={handleBinaryOp}
              >
                Exp
              </Button>
              <Button
                $isScientific={isScientific}
                value="cubeRoot"
                onClick={handleUnaryOp}
              >
                <BackSpace
                  src={imageHelper.getImage('cubeRoot.svg')}
                  alt="cubeRoot"
                />
              </Button>
              <Button
                $isScientific={isScientific}
                value="yLogX"
                onClick={handleBinaryOp}
              >
                log
                <sub>y</sub>x
              </Button>
            </Log>
          </>
        )}
        <Equal
          $isScientific={isScientific}
          onClick={handleButtonCommand}
          value="equal"
        >
          =
        </Equal>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default Calculator;

Calculator.propTypes = {
  isScientific: PropTypes.bool,
  className: PropTypes.string,
};

Calculator.defaultProps = {
  isScientific: false,
  className: '',
};
