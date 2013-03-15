var input = [];
// operators with priority
var operators = {
    '(': 1,
    ')': 1,
    '√': 2,
    '²': 2,
    '%': 3,
    '|': 3,
    '×': 4,
    '÷': 4,
    '+': 5,
    '-': 5
};

function enter() {
    var str = document.getElementById('display').value;
    for (var i = 0; i < str.length; i++) {
        input.push(str[i]);
    }
}

function press(val) {
    input.push(val);
    document.getElementById('display').value = input.join("");
    document.getElementById('error_message').value = '';
}

function back() {
    input.pop();
    document.getElementById('display').value = input.join("");
    document.getElementById('error_message').value = '';
}

function clear_all() {
    input = [];
    document.getElementById('display').value = input.join("");
    document.getElementById('error_message').value = '';
}

function complex(re,im) {
    return {
        "re": re,
        "im": im
    };
}

function add(A,B) {
    return complex(A.re + B.re, A.im + B.im);
}

function subt(A,B) {
    return complex(A.re - B.re, A.im - B.im);
}

function mult(A,B) {
    var re = A.re * B.re - A.im * B.im;
    var im = A.im * B.re + A.re * B.im;
    return complex(re,im);
}

function div(A,B) {
    var denominator = Math.pow(B.re,2) + Math.pow(B.im,2);
    var re = (A.re * B.re + A.im * B.im) / denominator;
    var im = (A.im * B.re - A.re * B.im) / denominator;
    return complex(re,im);
}

function pct(A) {
    return complex(A.re * 0.01, A.im * 0.01);
}

function neg(A) {
    return complex(-A.re,-A.im);
}

function pow2(A) {
    var r = Math.sqrt(Math.pow(A.re,2) + Math.pow(A.im,2)); // r is complex number modulus
    var re = (2 * Math.pow(A.re,2) - Math.pow(r,2));
    var im = 2 * A.re * A.im;
    return complex(re,im);
}

function sqrt(A) {
    var r = Math.sqrt(Math.pow(A.re,2) + Math.pow(A.im,2)); // r is complex number modulus
    var re = Math.sqrt((r + A.re) / 2);
    var im = Math.sqrt((r - A.re) / 2);
    return complex(re,im);
}

function rpn() {
    var output = [];
    var rpn = [];
    var stack = [];
    var item = ''; // It is a part of expression. It can be an operator or an operand.
    var regexp = /[0123456789\.i]/;

    // Create array output, so it looks like [523.3,'-',3] etc.
    for (var i = 0; i < input.length; i++) {
        if (regexp.test(input[i])) {
            if (input[i] == "i") {
                (item.length == 0) ? output.push(complex(0,0)) : output.push(complex(0,Number(item)));
                item = '';
            } else {
                item += input[i];
                if ( (i == input.length - 1) || (input[i+1] in operators) ) {
                    output.push(complex(Number(item),0));
                    item = '';
                }
            }
        } else {
            output.push(input[i]);
        }
    }

    //In this block minuses modify to unary minuses
    for (var j = 0; j < output.length; j++) {
        if (j == 0 || output[j-1] == "(") {
            switch (output[j]) {
                case "-":
                    output[j] = "|";
                    break;
                case "+":
                    output.splice(j,1);
                    break;
            }
        }
    }

    // Here reverse polish note creates
    var elem;
    for (var k = 0; k < output.length; k++) {
        elem = output[k];
        if (elem instanceof Object) {
            rpn.push(elem);
        } else {
            switch (elem) {
                case ")":
                    while (stack[stack.length - 1] != "(") {
                        rpn.push(stack.pop());
                    }
                    stack.pop();
                    break;
                case "(":
                    stack.push(elem);
                    if (output[k+1] == ")") {
                        stack.push(NaN);
                    }
                    break;
                default:
                    if ((elem == "²" || elem == "%") && (output[k+1] instanceof Object)) {
                        rpn.push(NaN);
                        break;
                    }
                    if (elem == "√" && (output[k-1] instanceof Object)) {
                        rpn.push(NaN);
                    } else {
                        var l = stack.length;
                        do {
                            if (l == 0) {
                                stack.push(elem);
                                break;
                            }
                            if (stack[l-1] != "(" && (operators[stack[l-1]] <= operators[elem])) {
                                rpn.push(stack.pop());
                            } else {
                                stack.push(elem);
                                break;
                            }
                            l--;
                        } while (l >= 0);
                    }
            }
        }
    }
    while (stack.length != 0) {
        rpn.push(stack.pop());
    }
    return rpn;
}

function calculator(rpn) {
    var display = document.getElementById('display');
    var error = document.getElementById('error_message');
    var len_start = rpn.length;
    var len_end;
    if (len_start <= 1) {
        error.value = "Enter expression";
    } else {
        for (var i = 0; i < len_start; i++) {
            if (rpn[i] instanceof Object) {
                if (rpn[i+1] in operators) {
                    switch (rpn[i+1]) {
                        case "√":
                            rpn.splice(i,2,sqrt(rpn[i]));
                            break;
                        case "²":
                            rpn.splice(i,2,pow2(rpn[i]));
                            break;
                        case "|":
                            rpn.splice(i,2,neg(rpn[i]));
                            break;
                        case "%":
                            rpn.splice(i,2,pct(rpn[i]));
                            break;
                        default:
                            break;
                    }
                } else if (rpn[i+2] in operators) {
                    switch (rpn[i+2]) {
                        case "+":
                            rpn.splice(i,3,add(rpn[i],rpn[i+1]));
                            break;
                        case "-":
                            rpn.splice(i,3,subt(rpn[i],rpn[i+1]));
                            break;
                        case "×":
                            rpn.splice(i,3,mult(rpn[i],rpn[i+1]));
                            break;
                        case "÷":
                            rpn.splice(i,3,div(rpn[i],rpn[i+1]));
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        len_end = rpn.length;
        if (len_end == 1) {
            input = [];
            var z = rpn.pop();
            if (z.re === 0) {
               (z.im === 0) ? (display.value = 0) : (display.value = z.im + "i");
            } else {
                if (z.im === 0) {
                    display.value = z.re;
                } else if (z.im > 0) {
                    display.value = z.re + "+" + z.im + "i";
                } else {
                    display.value = z.re + "" + z.im + "i";
                }
            }
            input.push(display.value);
        } else {
            (len_start == len_end) ? (error.value = "Incorrect expression") : (calculator(rpn));
        }
    }
}
