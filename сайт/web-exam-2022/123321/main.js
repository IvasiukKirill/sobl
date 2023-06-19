let apiKey = "eb3e7937-3673-4b44-b7b4-d266e8503ef3";
let apiUrl =
    "http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants";
let restaurantsJson;
let selectedRestaurant;
let setsJson;


async function getRestaurants() {
    let url = new URL(apiUrl);
    url.searchParams.set("api_key", apiKey);
    let response = await fetch(url);
    let json = await response.json();
    restaurantsJson = json;
    return json;
}

function createRestaurantTableItem(record) {
    let item = document.querySelector("#table-row").cloneNode(true);
    item.classList.remove("d-none");
    item.querySelector(".restaurant-name").innerHTML = record.name;
    item.querySelector(".restaurant-type").innerHTML = record.typeObject;
    item.querySelector(".restaurant-addr").innerHTML = record.address;
    item.querySelector(".restaurant-id").value = record.id;
    item.querySelector(".btn-choose").onclick = chooseRest;

    return item;
}

function renderRecords(records) {
    let restaurantTable = document.querySelector("tbody");
    for (let i = 0; i < records.length; i++) {
        restaurantTable.append(createRestaurantTableItem(records[i]));
    }
    getFilter();
}

function filterRecords() {
    let selectedAdm = document.getElementById("area").value;
    let selectedDistrict = document.getElementById("district").value;
    let selectedType = document.getElementById("type").value;
    let selectedDiscount = document.getElementById("discount").value;
    let restaurantTable = document.querySelector("tbody");
    while (restaurantTable.children.length > 1) {
        restaurantTable.removeChild(restaurantTable.lastChild);
    }

    for (let i = 0; i < restaurantsJson.length; i++) {
        if (
            (selectedAdm == "Не выбрано" ||
                selectedAdm == restaurantsJson[i].admArea) &&
            (selectedDistrict == "Не выбрано" ||
                selectedDistrict == restaurantsJson[i].district) &&
            (selectedDiscount == "Не выбрано" ||
                selectedDiscount == restaurantsJson[i].socialPrivileges) &&
            (selectedType == "Не выбрано" ||
                selectedType == restaurantsJson[i].typeObject)
        ) {
            restaurantTable.append(createRestaurantTableItem(restaurantsJson[i]));
        }
    }
}

function getFilter() {
    var arrType = [];
    for (let i = 0; i < restaurantsJson.length; i++) {
        arrType.push(restaurantsJson[i].typeObject);
    }
    var unarr = new Set(arrType);

    for (let value of unarr) {
        let qwe = document.createElement("option");
        qwe.innerHTML = value;
        document.querySelector("#type").appendChild(qwe);
    }

    var arrAdm = [];
    for (let i = 0; i < restaurantsJson.length; i++) {
        arrAdm.push(restaurantsJson[i].admArea);
    }
    var unarr = new Set(arrAdm);

    for (let value of unarr) {
        let qwe = document.createElement("option");
        qwe.innerHTML = value;
        document.querySelector("#area").appendChild(qwe);
    }

    var arrDistrict = [];
    for (let i = 0; i < restaurantsJson.length; i++) {
        arrDistrict.push(restaurantsJson[i].district);
    }
    var unarr = new Set(arrDistrict);

    for (let value of unarr) {
        let qwe = document.createElement("option");
        qwe.innerHTML = value;
        document.querySelector("#district").appendChild(qwe);
    }
}



function countplus(event) {
    let qwe = event.target.closest("div");    
    let count = qwe.querySelector('span')
    count.innerHTML++;
    checkoption();
}
function countmin(event) {
    let qwe = event.target.closest("div");    
    let count = qwe.querySelector('span')
    if (count.innerHTML>0)
        count.innerHTML--;
    checkoption();
}


function countOrder() {
    let CoOrder = document.querySelectorAll(".count-order");
    let countDish = document.querySelectorAll(".countSpan");
    let price = document.querySelectorAll(".pricing-card");
    let summ = 0;
    let masPrice = [];
    let masDish = [];
    for ( let h of price){
        masPrice.push(h.textContent)
    }
    for (let span of countDish) {
        masDish.push(span.textContent)
    }
    for (let i = 0; i<=9;i++){
        summ += masPrice[i+1]*masDish[i+1];
    }
    for (let i of CoOrder){
        i.innerHTML=summ;
    }
    
}

function checkoption() {
    countOrder();
    let CoOrder = document.querySelectorAll(".count-order");
    let option1 = document.getElementById("faster-delivery");
    let option2 = document.getElementById("soc-disc");
    if (option1.checked) {
        for (let i of CoOrder){
            i.innerHTML *=1.2;
        }
    }
    if (option2.checked && selectedRestaurant.socialPrivileges){
        for (let i of CoOrder){
            i.innerHTML *= 1-(selectedRestaurant.socialDiscount/100);
        }
    }
    else if ((!option1.checked && !option2.checked)) countOrder();
}






async function getSet() {
    let response = await fetch("http://161.97.92.112:30004/api/sets");
    let json = await response.json();
    setsJson=json;
    return json;
}

function createSet(record) {
    let cart = document.querySelector(".card").closest(".col").cloneNode(true);
    cart.classList.remove("d-none");
    cart.querySelector('img').src=record.img;
    cart.querySelector(".name-set").innerHTML=record.name;
    cart.querySelector(".description").innerHTML=record.description;
    return cart;

}

function recordSet(records) {
    let menu = document.querySelector(".card").closest(".row");
    for (let i = 0; i < records.length; i++) {
       menu.append(createSet(records[i]));
    }

    for (let btn of document.querySelectorAll(".btn-plus")) {
        btn.onclick = countplus;
    }
    for (let btn of document.querySelectorAll(".btn-minus")) {
        btn.onclick = countmin;
    }

}

function clearsets() {
    let menu = document.querySelectorAll(".cart");
    for (let i = 11; i < menu.length; i++) {
        menu[i].remove();
    }
}

function setPrice(){
    let price = document.querySelectorAll(".pricing-card")
    setnum=0;
    for (let h5 of price) {
        h5.innerHTML=selectedRestaurant["set_"+setnum];
        ++setnum;
    }
}

function chooseRest(event) {
    let id = event.target.closest("form").querySelector(".restaurant-id").value;
    getSet().then(recordSet).then(clearsets).then(function () {
        getRestById(id).then(setPrice).then(countOrder).then(checkoption)
    });


}

async function getRestById(id) {
    let url = new URL(apiUrl + `/${id}`);
    url.searchParams.set("api_key", apiKey);
    let response = await fetch(url);
    let json = await response.json();
    selectedRestaurant = json;
    return json;
}


function renderModalWindow () {
    let window = document.querySelector(".modal-body");
    let card = window.querySelector(".card");
    let count = [];
    let sets = document.querySelectorAll(".cart");

    let cardbd = card.querySelector(".card-body");

    while (cardbd.children.length > 1) {
        cardbd.removeChild(cardbd.lastChild);
    }
    for (let set of sets) {
        count.push(set.querySelector("span").textContent);
    }
    console.log(setsJson);
    for (let i = 1; i < count.length; i++) {
        if (count[i] !=0){
            let pos = window.querySelector("#pos-order").cloneNode(true);
            pos.classList.remove("d-none");
            pos.querySelector("img").src=setsJson[i-1].img;
            pos.querySelector("#name-dish").innerHTML = setsJson[i-1].name;
            pos.querySelector("#count-dish").innerHTML = count[i];
            pos.querySelector("#price-dish").innerHTML = selectedRestaurant["set_"+i];
            pos.querySelector("#count-price-dish").innerHTML = count[i]*selectedRestaurant["set_"+i];
            cardbd.append(pos);
        }
    }

    

    





    let optCont = document.querySelector(".option-container");
    optCont.innerHTML = "";

    let firstoption = document.createElement("span")
    firstoption.innerHTML = "Быстрая доставка";
    if (document.getElementById("faster-delivery").checked) optCont.append(firstoption);

    let secondoption = document.createElement("span")
    secondoption.innerHTML = "Социальная скидка";
    if (document.getElementById("soc-disc").checked) optCont.append(secondoption);

    document.querySelector("#nameRest").innerHTML = selectedRestaurant.name;
    document.querySelector("#auRest").innerHTML = selectedRestaurant.admArea;
    document.querySelector("#districtRest").innerHTML = selectedRestaurant.district;
    document.querySelector("#adressRest").innerHTML = selectedRestaurant.address;
    document.querySelector("#rateRest").innerHTML = selectedRestaurant.rate;

    let price = document.querySelector("#price-delivery").textContent;
    window.querySelector(".count-order").innerHTML=document.querySelector(".count-order").innerHTML;

    window.querySelector(".count-order").innerHTML-=-price;
    


}

function alert(message, type) {
    let alertPlaceholder = document.getElementById('liveAlertPlaceholder')

    let wrapper = document.createElement('div')
    wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'

    alertPlaceholder.append(wrapper)
}

function confirm(){
    alert("Заказ подтверждён", "success")
}

window.onload = function() {
    getRestaurants().then(renderRecords);
    document.querySelector("#find").onclick = filterRecords;
    document.querySelector("#faster-delivery").onclick = checkoption;
    document.querySelector("#soc-disc").onclick = checkoption;

    for (let btn of document.querySelectorAll(".btn-choose")) {
        btn.onclick = chooseRest;
    }

    document.querySelector(".btn-modal").onclick=renderModalWindow;
    document.querySelector("#confirm-order").onclick=confirm;

}