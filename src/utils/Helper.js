import { ExportToCsv } from "export-to-csv";
import jsPDF from "jspdf";
import momentTZ from "moment";
import 'moment/locale/es';

var currency = require("currency-formatter");
const TOKEN_KEY = "feathers-jwt";
export const moment = (locale) => {
  momentTZ.locale(locale || "es");
  return momentTZ;
};
export const exportToCsv = (data, options) => {
  const headers = options.headers;
  options = {
    fieldSeparator: options.fieldSeparator || ";",
    quoteStrings: '"',
    decimalSeparator: options.decimalSeparator || ".",
    showLabels: true,
    showTitle: true,
    title: options.title || "Report",
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: headers ? false : true,
    headers
    // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
  };
  const csvExporter = new ExportToCsv(options);
  if (data.length == 0) return;
  csvExporter.generateCsv(data);
};
export const exportTableToPdf = (data, options) => {
  let excludes = ["_id", "role", "status", "updatedAt", "createdAt"];
  let headers =
    options.headers || data.length
      ? Object.keys(data[0]).filter(key => excludes.indexOf(key) == -1)
      : [];

  if (!options.headers) {
    headers = headers.map(key => ({
      id: key,
      name: key,
      prompt: key,
      width: 35,
      align: "center",
      padding: 0
    }));
  }
  var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape" });
  doc.table(1, 1, data, headers);
  doc.save(options.name || "report.pdf");
};
export const money = (value, decimalSeparator) => {
  return currency.format(value, {
    code: "USD",
    decimalDigits: 0,
    precision: 0,
    decimalSeparator: "."
  });
};
export const decimal = (value, decimal = ",") => {
  return currency.format(value, {
    symbol: "",
    decimal,
    precision: 0,
    format: "%v %s" // %s is the symbol and %v is the value
  });
};

export const parseFormData = params => {
  const formData = new FormData();
  for (var s in params) {
    formData.append(s, params[s]);
  }
  return formData;
};
export const generateGET = options => {
  // Create string for GET requests in a url
  var payloads = "?";

  var i = 1;
  for (var key in options) {
    payloads += key + "=" + options[key];

    // Append & separator to all but last value
    if (i !== Object.keys(options).length) payloads += "&";

    i++;
  }

  return payloads;
};
/*
 ** Funcion Debounce:
 ** Mejora la Experiencia de usuario. ya que se ejecuta solo una vez al terminar de escribir.
 */
export const debounce = (fn, tiempo) => {
  let timeoutId;
  return function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const context = this;
    const args = arguments;
    timeoutId = setTimeout(() => {
      fn.apply(context, args);
    }, tiempo);
  };
};
export const autocomplete = (inp, arr) => {
  if (typeof inp === "string") inp = document.getElementById(inp);
  /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode === 40) {
      /*If the arrow DOWN key is pressed,
              increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode === 38) {
      //up
      /*If the arrow UP key is pressed,
              decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode === 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
          except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt !== x[i] && elmnt !== inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
};
export const capitalize = value => {
  return value.replace(/(W)+/g, "#");
};
/* Agregado por fvargas */
export const CamelCaseSplit = word => {
  if (typeof word !== "string") return word;
  let match = word.match(new RegExp(/(([A-Z]{1})([a-z]+))([\,])?/g));
  if (match) word = match.join(" ");
  return word;
};
export const isLogin = () => {
  if (localStorage.getItem(TOKEN_KEY)) {
    return true;
  }
  return false;
};
export const isAdmin = user => {
  user = user || localStorage.getItem("user");
  if (user) {
    if (typeof user == "string") user = JSON.parse(user);
    return user.role === "admin";
  }
  return false;
};
export const allowAccess = permissions => {
  if (!permissions) return true;
  let user = localStorage.getItem("user");
  if (user) {
    user = JSON.parse(user);
    if (!user.role) return false;
    return permissions.includes(user.role.toLowerCase());
  }
  return false;
};
