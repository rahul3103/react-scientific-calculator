/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
const strInf = 'Infinity';
const strNaN = 'NaN';
const strMathError = 'Math Error';
export const gamma = (n) => {
  const g = 7; // g represents the precision desired, p is the values of p[i] to plug into Lanczos' formula
  const p = [
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
  }
  n -= 1;
  let x = p[0];
  for (let i = 1; i < g + 2; i += 1) {
    x += p[i] / (n + i);
  }
  const t = n + g + 0.5;
  return Math.sqrt(2 * Math.PI) * t ** (n + 0.5) * Math.exp(-t) * x;
};
export const factorial = (n) => {
  if (n > 170) return strInf;
  if (n == 1 || n == 0) return 1;
  if (n < 0) return strMathError;
  if (n % 1 != 0) return gamma(n + 1);
  return n * factorial(n - 1);
};
export const nthroot = (x, n) => {
  try {
    const negate = n % 2 == 1 && x < 0;
    if (negate) x = -x;
    const possible = x ** (1 / n);
    n = possible ** n;
    if (Math.abs(x - n) < 1 && x > 0 == n > 0)
      return negate ? -possible : possible;
    return negate ? -possible : possible;
  } catch (e) {
    // do noting
  }
};
const changeXBasedOnMode = (mode, inputValue) => {
  if (mode == 'deg') return inputValue * (Math.PI / 180);
  if (mode == 'rad') return inputValue;
};
export const sinCalc = (mode, inputVal) => {
  const ipVal = changeXBasedOnMode(mode, inputVal);
  if ((ipVal.toFixed(8) % Math.PI).toFixed(8) == 0) return '0';
  return Math.sin(ipVal);
};
export const cosCalc = (mode, inputVal) => {
  const ipVal = changeXBasedOnMode(mode, inputVal);
  if (ipVal.toFixed(8) % (Math.PI / 2).toFixed(8) == '0') {
    if ((ipVal.toFixed(8) / (Math.PI / 2)).toFixed(8) % 2 == '0')
      return Math.cos(ipVal);
    return '0';
  }
  return Math.cos(ipVal);
};
export const tanCalc = (mode, inputVal) => {
  const ipVal = changeXBasedOnMode(mode, inputVal);
  if (ipVal % (Math.PI / 2) == '0') {
    if ((ipVal / (Math.PI / 2)) % 2 == '0') return '0';
    return strMathError;
  }
  return Math.tan(ipVal);
};
export const inverseSineH = (inputVal) =>
  Math.log(inputVal + Math.sqrt(inputVal * inputVal + 1));
const changeValOfInvBasedOnMode = (mode, ipVal) => {
  if (mode == 'deg') return (180 / Math.PI) * ipVal;
  return ipVal;
};
export const sinInvCalc = (mode, inputVal) => {
  const ipVal = Math.asin(inputVal);
  if (strNaN.indexOf(ipVal.toFixed(8)) > -1) return strMathError;
  return changeValOfInvBasedOnMode(mode, ipVal);
};
export const cosInvCalc = (mode, inputVal) => {
  const ipVal = Math.acos(inputVal);
  if (strNaN.indexOf(ipVal.toFixed(8)) > -1) return strMathError;
  return changeValOfInvBasedOnMode(mode, ipVal);
};
export const tanInvCalc = (mode, inputVal) => {
  const ipVal = Math.atan(inputVal);
  if (strNaN.indexOf(ipVal.toFixed(8)) > -1) return strMathError;
  return changeValOfInvBasedOnMode(mode, ipVal);
};
