const wrapper = document.querySelector(".wrapper"),
    inputPart = wrapper.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = inputPart.querySelector("input"),
    locationButton = inputPart.querySelector("button"),
    wIcon = document.querySelector(".weather-part img"),
    arrowBack = document.querySelector("header i");
let api;

inputField.addEventListener("keyup", (e) => {
    //Si el usuario presiona enter y el valor no es vacio
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationButton.addEventListener("click", () => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSucces, onError);
    }else{
        alert("Your browser does not support geolocation");
    }
});

function onSucces(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=b17fe0e3ddb41e0880c6980ff43485b4`;
    fetchData();
}

function onError(error){
    infoTxt.innerHTML = "Geolocation denied";
    infoTxt.classList.add("error");
}

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=b17fe0e3ddb41e0880c6980ff43485b4`;
    fetchData();
}

function fetchData(){
    infoTxt.innerHTML = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){
    infoTxt.classList.replace("pending", "error");
    if(info.cod == "404"){
        infoTxt.innerHTML = `${inputField.value} it is not a valid city.`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800){
            wIcon.src = "./icons/clear.svg"
        }else if(id >= 200 && id >= 232){
            wIcon.src = "./icons/storm.svg"
        }
        else if(id >= 600 && id >= 622){
            wIcon.src = "./icons/snow.svg"
        }
        else if(id >= 701 && id >= 781){
            wIcon.src = "./icons/haze.svg"
        }
        else if(id >= 801 && id >= 804){
            wIcon.src = "./icons/cloud.svg"
        }
        else if(id >= 300 && id >= 321){
            wIcon.src = "./icons/rain.svg"
        }

        wrapper.querySelector(".temp .numb").innerHTML = Math.floor(temp);
        wrapper.querySelector(".weather").innerHTML = description;
        wrapper.querySelector(".location span").innerHTML = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerHTML = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerHTML = `${humidity}%`;



        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active")
});