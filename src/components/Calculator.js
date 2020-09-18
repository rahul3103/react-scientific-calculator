import styled from 'styled-components';
import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';

const MainCalc = styled.div`
  box-sizing: border-box;
  width: 300px;
`;

const Flex = styled.div`
  display: flex;
`;

const SpecialButton = styled(Button)`
  width: 150px;
  background-color: ${({ disabled }) => (disabled ? 'grey' : 'yellow')};
`;

const Operator = styled(Button)`
  background-color: orange;
`;

const Calculator = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [number, setNumber] = useState('');
  const [degree, setDegree] = useState(false);

  const countElements = (element) => {
    let count = 0;
    for (let index = 0; index < input.length; index++) {
      if (input.charAt(index) === element) {
        count++;
      }
    }
    return count;
  };

  const lastInputElement = () => input[input.length - 1];

  const isDegreeOn = (val) => setDegree(val === 'Degrees');

  const addNumber = (val) => {
    // if input ends with ")" and contains a symbol do not add number
    if (!input.endsWith(')') && !input.match(/[a-z!π]/)) {
      // append the number to input
      setInput(input + val);
      setNumber(number + val);
    }
  };

  const addZero = (val) => {
    // if input is not empty then add zero
    if (input !== '') {
      // prevent from adding 0 if last element is not a number
      if (!isNaN(Number(lastInputElement()))) {
        setInput(input + val);
        setNumber(number + val);
      }
    }
  };

  const addOpenParentheses = (val) => {
    // if input ends with open parentheses and number of ")" is equal to numbber of "("
    if (!input.endsWith('(') && countElements(')') === countElements('(')) {
      // if it doesn't end with a Number and the last element is not ")" and there are letters and symbols do nothing
      if (
        isNaN(Number(lastInputElement())) &&
        !input.endsWith(')') &&
        !input.match(/[a-z!π]/)
      ) {
        setInput(input + val);
        setNumber(input + val);
      }
    }
  };

  const addCloseParentheses = (val) => {
    // if input last element is a number, and number of "(" is greater than the number of ")"
    if (
      !isNaN(Number(lastInputElement())) &&
      countElements('(') > countElements(')')
    ) {
      setInput(input + val);
      setNumber(input + val);
    }
  };

  const addMinusOperator = (val) => {
    // add negative negative number in case it's first number and when input is empty,
    //   or it ends with "(", "/", or "*"
    if (
      val === '-' &&
      (input === '' ||
        input.endsWith('(') ||
        input.endsWith('/') ||
        input.endsWith('*')) &&
      !input.match(/[a-z!π]/)
    ) {
      setInput(input + val);
      setNumber(input + val);
    }
    // if last element is a number, and there is no trigonometry, factorial or pi add minus
    else if (
      (!isNaN(Number(lastInputElement())) || lastInputElement() === ')') &&
      !input.match(/[a-z!π]/)
    ) {
      setInput(input + val);
      setNumber(input + val);
    }
  };

  const clear = () => {
    setInput('');
    setNumber('');
  };

  const del = () => {
    clear();
    setOutput('');
  };

  // avoid calling operation multiple times on the same input and if no. of "(" equals to no. of ")"
  const avoidMultipleCalls = () =>
    !input.match(/[a-z!π]/) && countElements('(') === countElements(')');

  const addOperator = (val) => {
    // prevent adding operator if last element is not a number or if it doesn't end with a ")"
    if (!isNaN(Number(lastInputElement())) || lastInputElement() === ')') {
      switch (val) {
        case 'sin(x)':
          if (avoidMultipleCalls()) setInput(`sin(${input})`);
          break;

        case 'cos(x)':
          if (avoidMultipleCalls()) setInput(`cos(${input})`);
          break;

        case 'tan(x)':
          if (avoidMultipleCalls()) setInput(`tan(${input})`);
          break;

        case 'cot(x)':
          if (avoidMultipleCalls()) setInput(`cot(${input})`);
          break;

        case '!':
          if (avoidMultipleCalls()) setInput(`(${input})!`);
          break;

        case 'π':
          if (avoidMultipleCalls()) setInput(`(${input})π`);
          break;

        // for simple operators
        default:
          // if same operator is not clicked twice, and input does not contains letters
          if (lastInputElement() !== val && !input.match(/[a-z!π]/)) {
            setInput(input + val);
            setNumber(number + val);
          }
          break;
      }
    }
  };

  const factorial = (num) => {
    if (num === 0) return 1;
    return num * factorial(num - 1);
  };

  const calculate = () => {
    // if input is empty, do nothing
    if (input.length > 0) {
      // if last element is a number or ")", or "!", or "π" calculate
      if (
        !isNaN(Number(lastInputElement())) ||
        input.endsWith(')') ||
        input.endsWith('!') ||
        input.endsWith('π')
      ) {
        let result = input; // save the input state into result variable
        setInput(''); // reset the input state to empty string

        // calculate sine
        if (result.includes('sin')) {
          const inputNumber = eval(number);
          // if degrees is true, calculate sine in degrees
          setOutput(
            degree
              ? Math.sin((inputNumber * Math.PI) / 180)
              : Math.sin(inputNumber)
          );
          setNumber('');
        }

        // calculate cosine
        else if (result.includes('cos')) {
          const inputNumber = eval(number);
          // if degrees is true, calculate cosine in degrees
          setOutput(
            degree
              ? Math.cos((inputNumber * Math.PI) / 180)
              : Math.cos(inputNumber)
          );
          setNumber('');
        }

        // calculate tan
        else if (result.includes('tan')) {
          const inputNumber = eval(number);
          // if degrees is true, calculate tangent in degrees
          setOutput(
            degree
              ? Math.tan((inputNumber * Math.PI) / 180)
              : Math.tan(inputNumber)
          );
          setNumber('');
        }

        // calculate cot
        else if (result.includes('cot')) {
          const inputNumber = eval(number);
          // if degrees is true, calculate cotangent in degrees
          setOutput(
            degree
              ? 1 / Math.tan((inputNumber * Math.PI) / 180)
              : 1 / Math.tan(inputNumber)
          );
          setNumber('');
        }

        // calculate factorial
        else if (result.endsWith('!')) {
          // the factorial will be parsed between braces therefore operations will be evaluated before factorial
          const number = Number(eval(number));
          // the limit for factorial is 170. Otherwise it outputs "Infinity".
          // To avoid RangeError: Maximum call stack size exceeded, set the limit to 170 factorial
          if (number > 170) {
            setOutput('Number is too large');
            return;
          }
          // if number is negative throw Negative Factorial Error
          if (number < 0) {
            setOutput('Negative Factorial Error');
            return;
          }
          // calculate factorial for the given number
          const finalResult = factorial(number); // the result from the factorial function
          setOutput(finalResult);
          setNumber('');
        }

        // calculate PI
        else if (result.includes('π')) {
          setOutput(eval(number) * Math.PI);
          setNumber('');
        }

        // for all common operators such as addition, subtraction, multiplication division and exponential
        else {
          result = eval(result);
          // if the number is too large, instead of displaying Infinity, display message
          if (result === Infinity) setOutput('Number is too big');
          else setOutput(result);
        }
      }
    }
  };

  return (
    <MainCalc>
      <Input>{input}</Input>
      <Input>{output}</Input>
      <Flex>
        <SpecialButton
          value="Radians"
          label="Radians"
          onClick={isDegreeOn}
          disabled={!degree}
        />
        <SpecialButton
          value="Degrees"
          label="Degrees"
          onClick={isDegreeOn}
          disabled={degree}
        />
      </Flex>
      <Flex>
        <Button value={1} label={1} onClick={addNumber} />
        <Button value={2} label={2} onClick={addNumber} />
        <Button value={3} label={3} onClick={addNumber} />
        <Operator value="*" label="*" onClick={addOperator} />
      </Flex>
      <Flex>
        <Button value={4} label={4} onClick={addNumber} />
        <Button value={5} label={5} onClick={addNumber} />
        <Button value={6} label={6} onClick={addNumber} />
        <Operator value="-" label="-" onClick={addMinusOperator} />
      </Flex>
      <Flex>
        <Button value={7} label={7} onClick={addNumber} />
        <Button value={8} label={8} onClick={addNumber} />
        <Button value={9} label={9} onClick={addNumber} />
        <Operator value="+" label="+" onClick={addOperator} />
      </Flex>
      <Flex>
        <Button value="=" label="=" onClick={calculate} />
        <Button value={0} label={0} onClick={addZero} />
        <Operator value="**" label="x^y" onClick={addOperator} />
        <Operator value="/" label="/" onClick={addOperator} />
      </Flex>
      <Flex>
        <Operator value="sin(x)" label="sin(x)" onClick={addOperator} />
        <Operator value="cos(x)" label="cos(x)" onClick={addOperator} />
        <Operator value="tan(x)" label="tan(x)" onClick={addOperator} />
        <Operator value="cot(x)" label="cot(x)" onClick={addOperator} />
      </Flex>
      <Flex>
        <Operator value="!" label="X!" onClick={addOperator} />
        <Operator value="π" label="π" onClick={addOperator} />
        <Operator value="(" label="(" onClick={addOpenParentheses} />
        <Operator value=")" label=")" onClick={addCloseParentheses} />
      </Flex>
      <Flex>
        <SpecialButton value="Clear" label="Clear" onClick={clear} />
        <SpecialButton value="Delete" label="Delete" onClick={del} />
      </Flex>
    </MainCalc>
  );
};

export default Calculator;
