var input = [];
// operators with priority
var operators =
{
    '(':1,
    ')':1,
    '√':2,
    '²':2,
    '%':3,
    '|':3,
    '×':4,
    '÷':4,
    '+':5,
    '-':5
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

function complex(re, im) {
    this.re = re;
    this.im = im;
    return [this.re,this.im];
}

function add(A,B) {
    return complex(A[0] + B[0], A[1] + B[1]);
}

function subt(A,B) {
    return complex(A[0] - B[0], A[1] - B[1]);
}

function mult(A,B) {
    var im = A[0] * B[0] - A[1] * B[1];
    var re = A[1] * B[0] + A[0] * B[1];
    return complex(re,im);
}

function div(A,B) {
    var denominator = Math.pow(B.re,2) + Math.pow(B.im,2);
    var re = (A[0] * B[0] + A[1] * B[1]) / denominator;
    var im = (A[1] * B[0] - A[0] * B[1]) / denominator;
    return complex(re,im);
}

function pct(A) {
    return complex(A[0] * 0.01, A[1] * 0.01);
}

function neg(A) {
    return complex(-A[0],-A[1]);
}

function pow2(A) {
    var r = Math.sqrt(Math.pow(A[0],2) + Math.pow(A[1],2)); // r is complex number modulus
    var re = (2 * Math.pow(A[0],2) - Math.pow(r,2));
    var im = 2 * A[0] * A[1];
    return complex(re,im);
}

function sqrt(A) {
    var r = Math.sqrt(Math.pow(A[0],2) + Math.pow(A[1],2)); // r is complex number modulus
    var re = Math.sqrt((r + A[0]) / 2);
    var im = Math.sqrt((r - A[0]) / 2);
    return complex(re,im);
}

function rpn() {
    var output = [];
    var rpn = [];
    var stack = [];
    var item = ''; // It is piece of expression. It can be operator or operand.
    var regexp = /[0123456789\.i]/;

    // Create array output, so it looks like [523.3,'-',3] etc.
    for (var i = 0; i < input.length; i++) {
        if (regexp.test(input[i])) {
            if (input[i] == "i") {
                if (item.length == 0) {
                    output.push(complex(0,0));
                } else {
                    output.push(complex(0,Number(item)));
                }
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
        if (elem instanceof Array) {
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
                    if ((elem == "²" || elem == "%") && (output[k+1] instanceof Array)) {
                        rpn.push(NaN);
                        break;
                    }
                    if (elem == "√" && (output[k-1] instanceof Array)) {
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
    if (rpn.length <= 1) {
        document.getElementById('error_message').value = "Enter expression";
    } else {
        var len_start = rpn.length;
        var len_end;
        for (var i = 0; i < rpn.length; i++) {
            if (rpn[i] instanceof Array) {
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
            if (z[0] === 0) {
                if (z[1] === 0) {
                    document.getElementById('display').value = "0";
                } else {
                    document.getElementById('display').value = String(z[1]) + "i";
                }
            } else {
                if (z[1] === 0) {
                    document.getElementById('display').value = String(z[0]);
                } else if (z[1] > 0) {
                    document.getElementById('display').value = String(z[0]) + "+" + String(z[1]) + "i";
                } else {
                    document.getElementById('display').value = String(z[0]) + String(z[1]) + "i";
                }
            }
            input.push(document.getElementById('display').value);
        } else {
            if (len_start == len_end) {
                document.getElementById('error_message').value = "Incorrect expression";
            } else {calculator(rpn);}
        }
    }
}