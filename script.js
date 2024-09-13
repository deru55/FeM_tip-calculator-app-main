const inputBill = document.getElementById("input-bill");
const inputTipCustom = document.getElementById("tip-value--custom");
const inputNumOfPeople = document.getElementById("input-num-of-people");
const tipAmountSpan = document.getElementById("tipAmtPerPerson");
const totalAmountSpan = document.getElementById("totalPerPerson");
const form = document.querySelector(".inputs-section > form");
const allInputsRadio = document.querySelectorAll(
  ".inputs-section > form input[type=radio]"
);
const resetBtn = document.getElementById("reset-btn");

form.addEventListener("input", (e) => {
  resetBtnDisabled();

  if (e.target.id === "input-num-of-people" && inputNumOfPeople.value === "0") {
    showError(e.target);
  } else if (
    Number(inputBill.value) !== 0 &&
    Number(inputNumOfPeople.value) !== 0
  ) {
    calculateFn();
  } else {
    updateOutputs(0, 0);
  }
});

inputTipCustom.addEventListener("click", () => {
  const selectedTip = document.querySelector(
    ".inputs-section > form input[type=radio]:checked"
  );

  if (selectedTip) selectedTip.checked = false;
  if (Number(inputBill.value) !== 0 && Number(inputNumOfPeople.value) !== 0) {
    calculateFn();
  }
});

allInputsRadio.forEach((item) => {
  item.addEventListener("click", () => {
    inputTipCustom.value = "";
  });
});

inputNumOfPeople.addEventListener("input", () => {
  hideError(inputNumOfPeople);
});

const calculateFn = () => {
  const selectedTip = document.querySelector(
    ".inputs-section > form input[type=radio]:checked"
  );
  const tip = selectedTip
    ? selectedTip.value
    : inputTipCustom.value
    ? inputTipCustom.value
    : false;

  //tip amount
  const tipAmount = tip
    ? (Number(formatNoCommas(inputBill)) * tip) /
      100 /
      Number(formatNoCommas(inputNumOfPeople))
    : 0;

  //total
  const total =
    Number(formatNoCommas(inputBill)) /
      Number(formatNoCommas(inputNumOfPeople)) +
    tipAmount;

  updateOutputs(tipAmount, total);
};

const updateOutputs = (tipAmount, total) => {
  tipAmountSpan.textContent = `$${tipAmount.toFixed(2)}`;
  totalAmountSpan.textContent = `$${total.toFixed(2)}`;
};

const reset = () => {
  const selectedTip = document.querySelector(
    ".inputs-section > form input[type=radio]:checked"
  );

  inputBill.value = "";
  inputTipCustom.value = "";
  inputNumOfPeople.value = "";
  if (selectedTip) selectedTip.checked = false;
  updateOutputs(0, 0);

  hideError(inputNumOfPeople);
  resetBtnDisabled();
};

resetBtn.addEventListener("click", reset);

const showError = (item) => {
  const parent = item.parentElement.parentElement;
  const errorField = parent.querySelector(".error");

  errorField.classList.add("visible");
  errorField.setAttribute("aria-hidden", false);
  errorField.setAttribute("aria-invalid", true);
  item.classList.add("invalid");

  updateOutputs(0, 0);
};

const hideError = (item) => {
  const parent = item.parentElement.parentElement;
  const errorField = parent.querySelector(".error");

  errorField.classList.remove("visible");
  errorField.setAttribute("aria-hidden", true);
  errorField.setAttribute("aria-invalid", false);
  item.classList.remove("invalid");

  updateOutputs(0, 0);
};

const formatNoCommas = (item) => {
  return item.value.replace(/[,\s]/g, "");
};

const matchRegex = (item) => {
  let givenNumber = formatNoCommas(item);
  let regex = /(\d+)?(\.\d*)?/;
  return givenNumber.match(regex);
};

const formatToCurrency = (item) => {
  item.addEventListener("input", (e) => {
    let match = matchRegex(item);

    let nfObject = new Intl.NumberFormat("en-GB");
    let output = `${match[1] !== undefined ? nfObject.format(match[1]) : ""}${
      match[2] !== undefined ? match[2] : ""
    }`;

    item.value = output;
  });

  item.addEventListener("change", (e) => {
    let match = matchRegex(item);

    if (match[1] === undefined && /^\./.test(match[2])) {
      let output = `0${match[2]}`;
      item.value = output;
    }
  });
};

[inputBill, inputNumOfPeople].forEach((item) => {
  formatToCurrency(item);
});

const resetBtnDisabled = () => {
  const selectedTip = document.querySelector(
    ".inputs-section > form input[type=radio]:checked"
  );
  const tip = selectedTip
    ? selectedTip.value
    : inputTipCustom.value
    ? inputTipCustom.value
    : false;

  if (inputBill.value !== "" || tip || inputNumOfPeople.value !== "") {
    resetBtn.disabled = false;
  } else {
    resetBtn.disabled = true;
  }
};

//prevent keypress
inputBill.addEventListener("keypress", (e) => {
  const allowedCharsRegex = /[0-9\.]+/;
  if (!allowedCharsRegex.test(e.key)) {
    e.preventDefault();
  }
});

[inputTipCustom, inputNumOfPeople].forEach((input) => {
  input.addEventListener("keypress", (e) => {
    const allowedCharsRegex = /[0-9]+/;
    if (!allowedCharsRegex.test(e.key)) {
      e.preventDefault();
    }
  });
});
