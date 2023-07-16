const steps = document.querySelectorAll(".stp");
const circleSteps = document.querySelectorAll(".step");
const formInputs1 = document.querySelectorAll(".step-1 form input");
const formInputs2 = document.querySelectorAll(".step-2 form input");
const activities = document.querySelectorAll(".plan-card");
const switcher = document.querySelector(".switch");
const addons = document.querySelectorAll(".box");
const total = document.querySelector(".total b");
const planPrice = document.querySelector(".plan-price");
let time;
let currentStep = 1;
let currentCircle = 0;
const obj = {
  plan: null,
  kind: null,
  price: null,
};
const selectedActivity = {
  name: 'Sedikit Aktif',
  kind: 'sedikit', // tidak, sedikit, cukup, sangat, super 
}

steps.forEach((step) => {
  const nextBtn = step.querySelector(".next-stp");
  const prevBtn = step.querySelector(".prev-stp");
  const showResultBtn = step.querySelector(".show-result-stp");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      document.querySelector(`.step-${currentStep}`).style.display = "none";
      currentStep--;
      document.querySelector(`.step-${currentStep}`).style.display = "flex";
      circleSteps[currentCircle].classList.remove("active");
      currentCircle--;
    });
  }
  if (nextBtn != null) {
    nextBtn.addEventListener("click", () => {
      document.querySelector(`.step-${currentStep}`).style.display = "none";
      let valid =  true;

      if (currentStep == 1) {
        valid = validateForm1();
      } else if (currentStep == 2) {
        valid = validateForm2();
      }
      

      if (currentStep < 3 && valid) {
        currentStep++;
        currentCircle++;
      }
      document.querySelector(`.step-${currentStep}`).style.display = "flex";
      circleSteps[currentCircle].classList.add("active");
      // summary(obj);
    });
  }

  if (showResultBtn != null) {
    showResultBtn.addEventListener("click", () => {
      calculateBMR();
    })
  }
  
});

function summary(obj) {
  const planName = document.querySelector(".plan-name");
  const planPrice = document.querySelector(".plan-price");
  planPrice.innerHTML = `${obj.price.innerText}`;
  planName.innerHTML = `${obj.plan.innerText} (${
    obj.kind ? "yearly" : "monthly"
  })`;
}

function validateForm1() {
  let valid = true;
  for (let i = 0; i < formInputs1.length; i++) {
    if (!formInputs1[i].value) {
      valid = false;
      formInputs1[i].classList.add("err");
      findLabel(formInputs1[i]).nextElementSibling.style.display = "flex";
    } else {
      formInputs1[i].classList.remove("err");
      if (findLabel(formInputs1[i]).nextElementSibling != null) {
        findLabel(formInputs1[i]).nextElementSibling.style.display = "none";
      }
    }
  }
  return valid;
}
function validateForm2() {
  let valid = true;
  for (let i = 0; i < formInputs2.length; i++) {
    if (!formInputs2[i].value) {
      valid = false;
      formInputs2[i].classList.add("err");
      findLabel(formInputs2[i]).nextElementSibling.style.display = "flex";
    } else {
      formInputs2[i].classList.remove("err");
      if (findLabel(formInputs2[i]).nextElementSibling != null) {
        findLabel(formInputs2[i]).nextElementSibling.style.display = "none";
      }
    }
  }
  return valid;
}


function findLabel(el) {
  const idVal = el.id;
  const labels = document.getElementsByTagName("label");
  for (let i = 0; i < labels.length; i++) {
    if (labels[i].htmlFor == idVal) return labels[i];
  }
}

activities.forEach((act) => {
  act.addEventListener("click", () => {
    document.querySelector(".selected").classList.remove("selected");
    act.classList.add("selected");
    const activityName = act.querySelector("b").innerHTML;
    const activityKind = act.id;
    selectedActivity.name = activityName;
    selectedActivity.kind = activityKind;
  });
});

// switcher.addEventListener("click", () => {
//   const val = switcher.querySelector("input").checked;
//   if (val) {
//     document.querySelector(".monthly").classList.remove("sw-active");
//     document.querySelector(".yearly").classList.add("sw-active");
//   } else {
//     document.querySelector(".monthly").classList.add("sw-active");
//     document.querySelector(".yearly").classList.remove("sw-active");
//   }
//   switchPrice(val);
//   obj.kind = val;
// });
// addons.forEach((addon) => {
//   addon.addEventListener("click", (e) => {
//     const addonSelect = addon.querySelector("input");
//     const ID = addon.getAttribute("data-id");
//     if (addonSelect.checked) {
//       addonSelect.checked = false;
//       addon.classList.remove("ad-selected");
//       showAddon(ID, false);
//     } else {
//       addonSelect.checked = true;
//       addon.classList.add("ad-selected");
//       showAddon(addon, true);
//       e.preventDefault();
//     }
//   });
// });

function switchPrice(checked) {
  const yearlyPrice = [90, 120, 150];
  const monthlyPrice = [9, 12, 15];
  const prices = document.querySelectorAll(".plan-priced");
  if (checked) {
    prices[0].innerHTML = `$${yearlyPrice[0]}/yr`;
    prices[1].innerHTML = `$${yearlyPrice[1]}/yr`;
    prices[2].innerHTML = `$${yearlyPrice[2]}/yr`;
    setTime(true);
  } else {
    prices[0].innerHTML = `$${monthlyPrice[0]}/mo`;
    prices[1].innerHTML = `$${monthlyPrice[1]}/mo`;
    prices[2].innerHTML = `$${monthlyPrice[2]}/mo`;
    setTime(false);
  }
}
function showAddon(ad, val) {
  const temp = document.getElementsByTagName("template")[0];
  const clone = temp.content.cloneNode(true);
  const serviceName = clone.querySelector(".service-name");
  const servicePrice = clone.querySelector(".servic-price");
  const serviceID = clone.querySelector(".selected-addon");
  if (ad && val) {
    serviceName.innerText = ad.querySelector("label").innerText;
    servicePrice.innerText = ad.querySelector(".price").innerText;
    serviceID.setAttribute("data-id", ad.dataset.id);
    document.querySelector(".addons").appendChild(clone);
  } else {
    const addons = document.querySelectorAll(".selected-addon");
    addons.forEach((addon) => {
      const attr = addon.getAttribute("data-id");
      if (attr == ad) {
        addon.remove();
      }
    });
  }
}


function calculateBMR() {
  const phone = document.getElementById('phone').value;
  const city = document.getElementById('city').value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const age = parseFloat(document.getElementById('age').value.replace(",", "."));
  const weight = parseFloat(document.getElementById('weight').value.replace(",", "."));
  const height = parseFloat(document.getElementById('height').value.replace(",", "."));

  let genderConst = gender == 'male' ? 5 : -161;

  const bmrResult = 10 * weight + 6.25 * height - 5 * age + genderConst;

  console.log('LL: BMR Result : ' + bmrResult.toFixed());
}

function autocomplete(inp, arr) {
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
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
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
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
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
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

var city = [
  "ACEH SELATAN",
"ACEH TENGGARA",
"ACEH TIMUR",
"ACEH TENGAH",
"ACEH BARAT",
"ACEH BESAR",
"PIDIE",
"ACEH UTARA",
"SIMEULUE",
"ACEH SINGKIL",
"BIREUEN",
"ACEH BARAT DAYA",
"GAYO LUES",
"ACEH JAYA",
"NAGAN RAYA",
"ACEH TAMIANG",
"BENER MERIAH",
"PIDIE JAYA",
"BANDA ACEH",
"SABANG",
"LHOKSEUMAWE",
"LANGSA",
"SUBULUSSALAM",
"TAPANULI TENGAH",
"TAPANULI UTARA",
"TAPANULI SELATAN",
"NIAS",
"LANGKAT",
"KARO",
"DELI SERDANG",
"SIMALUNGUN",
"ASAHAN",
"LABUHANBATU",
"DAIRI",
"TOBA SAMOSIR",
"MANDAILING NATAL",
"NIAS SELATAN",
"PAKPAK BHARAT",
"HUMBANG HASUNDUTAN",
"SAMOSIR",
"SERDANG BEDAGAI",
"BATU BARA",
"PADANG LAWAS UTARA",
"PADANG LAWAS",
"LABUHANBATU SELATAN",
"LABUHANBATU UTARA",
"NIAS UTARA",
"NIAS BARAT",
"MEDAN",
"PEMATANGSIANTAR",
"SIBOLGA",
"TANJUNG BALAI",
"BINJAI",
"TEBING TINGGI",
"PADANG SIDEMPUAN",
"GUNUNGSITOLI",
"PESISIR SELATAN",
"SOLOK",
"SIJUNJUNG",
"TANAH DATAR",
"PADANG PARIAMAN",
"AGAM",
"LIMA PULUH KOTA",
"PASAMAN",
"KEPULAUAN MENTAWAI",
"DHARMASRAYA",
"SOLOK SELATAN",
"PASAMAN BARAT",
"PADANG",
"SOLOK",
"SAWAHLUNTO",
"PADANG PANJANG",
"BUKITTINGGI",
"PAYAKUMBUH",
"PARIAMAN",
"KAMPAR",
"INDRAGIRI HULU",
"BENGKALIS",
"INDRAGIRI HILIR",
"PELALAWAN",
"ROKAN HULU",
"ROKAN HILIR",
"SIAK",
"KUANTAN SINGINGI",
"KEPULAUAN MERANTI",
"PEKANBARU",
"DUMAI",
"KERINCI",
"MERANGIN",
"SAROLANGUN",
"BATANGHARI",
"MUARO JAMBI",
"TANJUNG JABUNG BARAT",
"TANJUNG JABUNG TIMUR",
"BUNGO",
"TEBO",
"JAMBI",
"SUNGAI PENUH",
"OGAN KOMERING ULU",
"OGAN KOMERING ILIR",
"MUARA ENIM",
"LAHAT",
"MUSI RAWAS",
"MUSI BANYUASIN",
"BANYUASIN",
"OGAN KOMERING ULU TIMUR",
"OGAN KOMERING ULU SELATAN",
"OGAN ILIR",
"EMPAT LAWANG",
"PENUKAL ABAB LEMATANG ILIR",
"MUSI RAWAS UTARA",
"PALEMBANG",
"PAGAR ALAM",
"LUBUK LINGGAU",
"PRABUMULIH",
"BENGKULU SELATAN",
"REJANG LEBONG",
"BENGKULU UTARA",
"KAUR",
"SELUMA",
"MUKO MUKO",
"LEBONG",
"KEPAHIANG",
"BENGKULU TENGAH",
"BENGKULU",
"LAMPUNG SELATAN",
"LAMPUNG TENGAH",
"LAMPUNG UTARA",
"LAMPUNG BARAT",
"TULANG BAWANG",
"TANGGAMUS",
"LAMPUNG TIMUR",
"WAY KANAN",
"PESAWARAN",
"PRINGSEWU",
"MESUJI",
"TULANG BAWANG BARAT",
"PESISIR BARAT",
"BANDAR LAMPUNG",
"METRO",
"BANGKA",
"BELITUNG",
"BANGKA SELATAN",
"BANGKA TENGAH",
"BANGKA BARAT",
"BELITUNG TIMUR",
"PANGKAL PINANG",
"BINTAN",
"KARIMUN",
"NATUNA",
"LINGGA",
"KEPULAUAN ANAMBAS",
"BATAM",
"TANJUNG PINANG",
"KEP. SERIBU",
"JAKARTA PUSAT",
"JAKARTA UTARA",
"JAKARTA BARAT",
"JAKARTA SELATAN",
"JAKARTA TIMUR",
"BOGOR",
"SUKABUMI",
"CIANJUR",
"BANDUNG",
"GARUT",
"TASIKMALAYA",
"CIAMIS",
"KUNINGAN",
"CIREBON",
"MAJALENGKA",
"SUMEDANG",
"INDRAMAYU",
"SUBANG",
"PURWAKARTA",
"KARAWANG",
"BEKASI",
"BANDUNG BARAT",
"PANGANDARAN",
"BOGOR",
"SUKABUMI",
"BANDUNG",
"CIREBON",
"BEKASI",
"DEPOK",
"CIMAHI",
"TASIKMALAYA",
"BANJAR",
"CILACAP",
"BANYUMAS",
"PURBALINGGA",
"BANJARNEGARA",
"KEBUMEN",
"PURWOREJO",
"WONOSOBO",
"MAGELANG",
"BOYOLALI",
"KLATEN",
"SUKOHARJO",
"WONOGIRI",
"KARANGANYAR",
"SRAGEN",
"GROBOGAN",
"BLORA",
"REMBANG",
"PATI",
"KUDUS",
"JEPARA",
"DEMAK",
"SEMARANG",
"TEMANGGUNG",
"KENDAL",
"BATANG",
"PEKALONGAN",
"PEMALANG",
"TEGAL",
"BREBES",
"MAGELANG",
"SURAKARTA",
"SALATIGA",
"SEMARANG",
"PEKALONGAN",
"TEGAL",
"KULON PROGO",
"BANTUL",
"GUNUNGKIDUL",
"SLEMAN",
"YOGYAKARTA",
"PACITAN",
"PONOROGO",
"TRENGGALEK",
"TULUNGAGUNG",
"BLITAR",
"KEDIRI",
"MALANG",
"LUMAJANG",
"JEMBER",
"BANYUWANGI",
"BONDOWOSO",
"SITUBONDO",
"PROBOLINGGO",
"PASURUAN",
"SIDOARJO",
"MOJOKERTO",
"JOMBANG",
"NGANJUK",
"MADIUN",
"MAGETAN",
"NGAWI",
"BOJONEGORO",
"TUBAN",
"LAMONGAN",
"GRESIK",
"BANGKALAN",
"SAMPANG",
"PAMEKASAN",
"SUMENEP",
"KEDIRI",
"BLITAR",
"MALANG",
"PROBOLINGGO",
"PASURUAN",
"MOJOKERTO",
"MADIUN",
"SURABAYA",
"BATU",
"PANDEGLANG",
"LEBAK",
"TANGERANG",
"SERANG",
"TANGERANG",
"CILEGON",
"SERANG",
"TANGERANG SELATAN",
"JEMBRANA",
"TABANAN",
"BADUNG",
"GIANYAR",
"KLUNGKUNG",
"BANGLI",
"KARANGASEM",
"BULELENG",
"DENPASAR",
"LOMBOK BARAT",
"LOMBOK TENGAH",
"LOMBOK TIMUR",
"SUMBAWA",
"DOMPU",
"BIMA",
"SUMBAWA BARAT",
"LOMBOK UTARA",
"MATARAM",
"BIMA",
"KUPANG",
"KAB TIMOR TENGAH SELATAN",
"TIMOR TENGAH UTARA",
"BELU",
"ALOR",
"FLORES TIMUR",
"SIKKA",
"ENDE",
"NGADA",
"MANGGARAI",
"SUMBA TIMUR",
"SUMBA BARAT",
"LEMBATA",
"ROTE NDAO",
"MANGGARAI BARAT",
"NAGEKEO",
"SUMBA TENGAH",
"SUMBA BARAT DAYA",
"MANGGARAI TIMUR",
"SABU RAIJUA",
"MALAKA",
"KUPANG",
"SAMBAS",
"MEMPAWAH",
"SANGGAU",
"KETAPANG",
"SINTANG",
"KAPUAS HULU",
"BENGKAYANG",
"LANDAK",
"SEKADAU",
"MELAWI",
"KAYONG UTARA",
"KUBU RAYA",
"PONTIANAK",
"SINGKAWANG",
"KOTAWARINGIN BARAT",
"KOTAWARINGIN TIMUR",
"KAPUAS",
"BARITO SELATAN",
"BARITO UTARA",
"KATINGAN",
"SERUYAN",
"SUKAMARA",
"LAMANDAU",
"GUNUNG MAS",
"PULANG PISAU",
"MURUNG RAYA",
"BARITO TIMUR",
"PALANGKARAYA",
"TANAH LAUT",
"KOTABARU",
"BANJAR",
"BARITO KUALA",
"TAPIN",
"HULU SUNGAI SELATAN",
"HULU SUNGAI TENGAH",
"HULU SUNGAI UTARA",
"TABALONG",
"TANAH BUMBU",
"BALANGAN",
"BANJARMASIN",
"BANJARBARU",
"PASER",
"KUTAI KARTANEGARA",
"BERAU",
"KUTAI BARAT",
"KUTAI TIMUR",
"PENAJAM PASER UTARA",
"MAHAKAM ULU",
"BALIKPAPAN",
"SAMARINDA",
"BONTANG",
"BULUNGAN",
"MALINAU",
"NUNUKAN",
"TANA TIDUNG",
"TARAKAN",
"BOLAANG MONGONDOW",
"MINAHASA",
"KEPULAUAN SANGIHE",
"KEPULAUAN TALAUD",
"MINAHASA SELATAN",
"MINAHASA UTARA",
"MINAHASA TENGGARA",
"BOLAANG MONGONDOW UTARA",
"KEP. SIAU TAGULANDANG BIARO",
"BOLAANG MONGONDOW TIMUR",
"BOLAANG MONGONDOW SELATAN",
"MANADO",
"BITUNG",
"TOMOHON",
"KOTAMOBAGU",
"BANGGAI",
"POSO",
"DONGGALA",
"TOLI TOLI",
"BUOL",
"MOROWALI",
"BANGGAI KEPULAUAN",
"PARIGI MOUTONG",
"TOJO UNA UNA",
"SIGI",
"BANGGAI LAUT",
"MOROWALI UTARA",
"PALU",
"KEPULAUAN SELAYAR",
"BULUKUMBA",
"BANTAENG",
"JENEPONTO",
"TAKALAR",
"GOWA",
"SINJAI",
"BONE",
"MAROS",
"PANGKAJENE KEPULAUAN",
"BARRU",
"SOPPENG",
"WAJO",
"SIDENRENG RAPPANG",
"PINRANG",
"ENREKANG",
"LUWU",
"TANA TORAJA",
"LUWU UTARA",
"LUWU TIMUR",
"TORAJA UTARA",
"MAKASSAR",
"PARE PARE",
"PALOPO",
"KOLAKA",
"KONAWE",
"MUNA",
"BUTON",
"KONAWE SELATAN",
"BOMBANA",
"WAKATOBI",
"KOLAKA UTARA",
"KONAWE UTARA",
"BUTON UTARA",
"KOLAKA TIMUR",
"KONAWE KEPULAUAN",
"MUNA BARAT",
"BUTON TENGAH",
"BUTON SELATAN",
"KENDARI",
"BAU BAU",
"GORONTALO",
"BOALEMO",
"BONE BOLANGO",
"PAHUWATO",
"GORONTALO UTARA",
"GORONTALO",
"PASANGKAYU",
"MAMUJU",
"MAMASA",
"POLEWALI MANDAR",
"MAJENE",
"MAMUJU TENGAH",
"MALUKU TENGAH",
"MALUKU TENGGARA",
"KEPULAUAN TANIMBAR",
"BURU",
"SERAM BAGIAN TIMUR",
"SERAM BAGIAN BARAT",
"KEPULAUAN ARU",
"MALUKU BARAT DAYA",
"BURU SELATAN",
"AMBON",
"TUAL",
"HALMAHERA BARAT",
"HALMAHERA TENGAH",
"HALMAHERA UTARA",
"HALMAHERA SELATAN",
"KEPULAUAN SULA",
"HALMAHERA TIMUR",
"PULAU MOROTAI",
"PULAU TALIABU",
"TERNATE",
"TIDORE KEPULAUAN",
"MERAUKE",
"JAYAWIJAYA",
"JAYAPURA",
"NABIRE",
"KEPULAUAN YAPEN",
"BIAK NUMFOR",
"PUNCAK JAYA",
"PANIAI",
"MIMIKA",
"SARMI",
"KEEROM",
"KAB PEGUNUNGAN BINTANGPUNCAK",
"YAHUKIMO",
"TOLIKARA",
"WAROPEN",
"BOVEN DIGOEL",
"MAPPI",
"ASMAT",
"SUPIORI",
"MAMBERAMO RAYA",
"MAMBERAMO TENGAH",
"YALIMO",
"LANNY JAYA",
"NDUGA",
"PUNCAK",
"DOGIYAI",
"INTAN JAYA",
"DEIYAI",
"JAYAPURA",
"SORONG",
"MANOKWARI",
"FAK FAK",
"SORONG SELATAN",
"RAJA AMPAT",
"TELUK BINTUNI",
"TELUK WONDAMA",
"KAIMANA",
"TAMBRAUW",
"MAYBRAT",
"MANOKWARI SELATAN",
"PEGUNUNGAN ARFAK",
"SORONG"
];

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("city"), city);