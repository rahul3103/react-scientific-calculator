import React, { useState } from 'react';

function isWhole(n) {
  var result = n - Math.floor(n) !== 0;
  if (result) return false;
  return true;
}

function gamma(n) {
  // accurate to about 15 decimal places
  //some magic constants
  var g = 7, // g represents the precision desired, p is the values of p[i] to plug into Lanczos' formula
    p = [
      0.99999999999980993,
      676.5203681218851,
      -1259.1392167224028,
      771.32342877765313,
      -176.61502916214059,
      12.507343278686905,
      -0.13857109526572012,
      9.9843695780195716e-6,
      1.5056327351493116e-7,
    ];
  if (n < 0.5) {
    return Math.PI / Math.sin(n * Math.PI) / gamma(1 - n);
  } else {
    n--;
    var x = p[0];
    for (var i = 1; i < g + 2; i++) {
      x += p[i] / (n + i);
    }
    var t = n + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x;
  }
}

function factorial(n) {
  if (n == 0 || n == 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

function findFactorial(n) {
  if (n > 170) return 'Math error';
  if (isWhole(n)) return factorial(n);
  return gamma(n + 1);
}

const Calculator = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('0');
  const [number, setNumber] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [isDegree, setIsDegree] = useState(true);
  const handleRadio = (event) => setIsDegree(event.target.value === 'Degree');
  const handleClear = () => {
    setInput('');
    setNumber('');
    setOutput('0');
    setCalculated(false);
  };
  const handleBackspace = () => {
    if (calculated || output === '0') return;
    if (output.length === 1) setOutput('0');
    else setOutput(output.slice(0, -1));
  };
  const handleNum = (e) => {
    if (calculated) {
      setInput('');
      setNumber('');
      setOutput(e.target.value);
      setCalculated(false);
    } else if (output === '0') setOutput(e.target.value);
    else setOutput(`${output}${e.target.value}`);
  };

  const handleDecimal = () => {
    if (output.includes('.')) return;
    if (calculated) {
      setInput('');
      setNumber('');
      setOutput('.');
      setCalculated(false);
    } else if (output === '0') setOutput('0.');
    else setOutput(`${output}.`);
  };

  const handleBinaryOp = (e) => {
    setCalculated(false);
    setInput(`${output}${e.target.value}`);
    setNumber(`${output}${e.target.value}`);
    setOutput('0');
  };
  const handleUnaryOp = (e) => {
    const op = e.target.value;
    let val = '';
    switch (op) {
      case 'sin':
        val = Math.sin(isDegree ? (output * Math.PI) / 180 : output);
        setInput(`${input}sin(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'cos':
        val = Math.cos(isDegree ? (output * Math.PI) / 180 : output);
        setInput(`${input}cos(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'tan':
        val = Math.tan(isDegree ? (output * Math.PI) / 180 : output);
        setInput(`${input}tan(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'sinh':
        val = Math.sinh(output);
        setInput(`${input}sinh(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'cosh':
        val = Math.cosh(output);
        setInput(`${input}cosh(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'tanh':
        val = Math.tanh(output);
        setInput(`${input}tanh(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'sinInv':
        val = isDegree
          ? (Math.asin(output) * 180) / Math.PI
          : Math.asin(output);
        setInput(`${input}sin-1(${output})`);
        setOutput(`${!isNaN(val) ? val : 'Math error'}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'cosInv':
        val = isDegree
          ? (Math.acos(output) * 180) / Math.PI
          : Math.acos(output);
        setInput(`${input}cos-1(${output})`);
        setOutput(`${!isNaN(val) ? val : 'Math error'}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'tanInv':
        val = isDegree
          ? (Math.atan(output) * 180) / Math.PI
          : Math.atan(output);
        setInput(`${input}tan-1(${output})`);
        setOutput(`${!isNaN(val) ? val : 'Math error'}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'sinhInv':
        val = Math.asinh(output);
        setInput(`${input}sinh-1(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'coshInv':
        val = Math.acosh(output);
        setInput(`${input}cosh-1(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        break;

      case 'tanhInv':
        val = Math.atanh(output);
        setInput(`${input}tanh-1(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'pi':
        setOutput(`${Math.PI}`);
        setCalculated(true);
        break;

      case 'exp':
        setOutput(`${Math.E}`);
        setCalculated(true);
        break;

      case 'fact':
        val = findFactorial(output);
        setInput(`${input}fact(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'logBase2':
        val = Math.log2(output);
        setInput(`${input}logXbase2(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'cube':
        val = Math.pow(output, 3);
        setInput(`${input}cube(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'sqr':
        val = Math.pow(output, 2);
        setInput(`${input}sqr(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'powTen':
        val = Math.pow(10, output);
        setInput(`${input}powten(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'powe':
        val = Math.pow(Math.E, output);
        setInput(`${input}powe(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'cuberoot':
        val = Math.pow(output, 1 / 3);
        setInput(`${input}cuberoot(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'sqrt':
        val = Math.pow(output, 1 / 2);
        setInput(`${input}sqrt(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'reciproc':
        val = 1 / output;
        setInput(`${input}reciproc(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'ln':
        val = Math.log(output);
        setInput(`${input}ln(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      case 'log':
        val = Math.log10(output);
        setInput(`${input}log(${output})`);
        setOutput(`${val}`);
        setNumber(`${input}`);
        setCalculated(true);
        break;

      default:
        return;
    }
  };
  const calculate = () => {
    debugger;
    if (calculated) return;
    if (['+', '-', '/', '*', '^'].includes(input[input.length - 1]))
      setInput(`${input}${output}`);
    if (input[input.length - 1] === '^')
      setOutput(Math.pow(input.slice(0, -1), output));
    else setOutput(`${eval(number + output)}`);
    setCalculated(true);
  };
  return (
    <div style={{ width: '400px' }}>
      <div style={{ border: '1px solid', height: '40px', width: '400px' }}>
        <span>Input -> {input}</span>
      </div>
      <div style={{ border: '1px solid', height: '40px', width: '400px' }}>
        <span>Output -> {output}</span>
      </div>
      <input
        type="radio"
        value="Degree"
        checked={isDegree}
        onClick={handleRadio}
      />
      Degree
      <input
        type="radio"
        value="Radians"
        checked={!isDegree}
        onClick={handleRadio}
      />
      Radians
      <button
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleClear}
      >
        C
      </button>
      <button
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleBackspace}
      >
        ←
      </button>
      <button
        value={1}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleNum}
      >
        1
      </button>
      <button
        value={2}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleNum}
      >
        2
      </button>
      <button
        value={3}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleNum}
      >
        3
      </button>
      <button
        value={4}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleNum}
      >
        4
      </button>
      <button
        value={5}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleNum}
      >
        5
      </button>
      <button
        value={6}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleNum}
      >
        6
      </button>
      <button
        value={7}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleNum}
      >
        7
      </button>
      <button
        value={8}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleNum}
      >
        8
      </button>
      <button
        value={9}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleNum}
      >
        9
      </button>
      <button
        value={0}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleNum}
        label={0}
      >
        0
      </button>
      <button
        value={'.'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleDecimal}
      >
        .
      </button>
      <button
        value={'+'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleBinaryOp}
      >
        +
      </button>
      <button
        value={'-'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleBinaryOp}
      >
        -
      </button>
      <button
        value={'*'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleBinaryOp}
      >
        *
      </button>
      <button
        value={'/'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleBinaryOp}
      >
        /
      </button>
      <button
        value={'sin'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        sin
      </button>
      <button
        value={'cos'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        cos
      </button>
      <button
        value={'tan'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        tan
      </button>
      <button
        value={'sinh'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        sinh
      </button>
      <button
        value={'cosh'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        cosh
      </button>
      <button
        value={'tanh'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        tanh
      </button>
      <button
        value={'sinInv'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        sin<sup>-1</sup>
      </button>
      <button
        value={'cosInv'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        cos<sup>-1</sup>
      </button>
      <button
        value={'tanInv'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        tan<sup>-1</sup>
      </button>
      <button
        value={'sinhInv'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        sinh<sup>-1</sup>
      </button>
      <button
        value={'coshInv'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        cosh<sup>-1</sup>
      </button>
      <button
        value={'tanhInv'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        tanh<sup>-1</sup>
      </button>
      <button
        value={'pi'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        π
      </button>
      <button
        value={'exp'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        e
      </button>
      <button
        value={'fact'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        n!
      </button>
      <button
        value={'logBase2'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        log<sub>2</sub>x
      </button>
      <button
        value={'^'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleBinaryOp}
      >
        x<sup>y</sup>
      </button>
      <button
        value={'cube'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        x<sup>3</sup>
      </button>
      <button
        value={'sqr'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        x<sup>2</sup>
      </button>
      <button
        value={'powTen'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        10<sup>x</sup>
      </button>
      <button
        value={'powe'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        e<sup>x</sup>
      </button>
      <button
        value={'cuberoot'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        ∛
      </button>
      <button
        value={'sqrt'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        √
      </button>
      <button
        value={'reciproc'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        1/x
      </button>
      <button
        value={'ln'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        ln
      </button>
      <button
        value={'log'}
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={handleUnaryOp}
      >
        log
      </button>
      <button
        style={{ border: '1px solid', height: '40px', width: '60px' }}
        onClick={calculate}
      >
        =
      </button>
    </div>
  );
};

export default Calculator;
