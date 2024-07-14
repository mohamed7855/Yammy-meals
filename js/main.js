// when html loaded
$(function () {
  eventClickNavLink();
  let navWidth = $("aside .menu").outerWidth(true);
  onepCloseNav(navWidth);
  hideNav();
  mainData();

  $("body").css("overflow", "auto");
  $("aside").css("z-index", "9");
});

// add event for nav aside links
function eventClickNavLink() {
  $("aside  a.navLink").on("click", function () {
    const href = $(this).attr("href");
    $(href).removeClass("d-none").siblings("section,main").addClass("d-none");

    const sectionName = href.slice(1);
    if (sectionName === "Categories") {
      Categories();
    } else if (sectionName === "Area") {
      Area();
    } else if (sectionName === "Ingredients") {
      Ingredients();
    } else if (sectionName === "ContactUs") {
      ContactUs();
    } else if (sectionName === "mainData") {
      mainData();
    }
    hideNav();
  });
}

function hideNav() {
  $("aside .menu").animate(
    { width: "0", paddingInline: "0px", paddingTop: "150px" },
    1000
  );
  $("aside .links").animate({ height: "0" }, 1000);
  $("aside .open-close-icon").removeClass("fa-x").addClass("fa-bars");
}

function showNav(navWidth) {
  $("aside .open-close-icon").removeClass("fa-bars").addClass("fa-x");
  $("aside .menu").animate({ width: `${navWidth}`, padding: "24px" }, 500);
  $("aside .links").css("height", "fit-content");
}

function onepCloseNav(navWidth) {
  $("aside .open-close-icon").on("click", function () {
    if ($(this).hasClass("fa-x")) {
      hideNav();
    } else {
      showNav(navWidth);
    }
  });
}

async function fetchData(
  mealName,
  mealId,
  mealFirstLetter,
  categories,
  categoryName,
  areas,
  areaName,
  ingredients,
  ingredientName
) {
  // show loading for getting data
  $(".loading").css("display", "grid");
  $(".loader").css("display", "inline-block");

  // hide loading for showing data
  $(".loader").fadeOut(500, function () {
    $(".loading").fadeOut(500);
  });

  const baseUrl = "https://www.themealdb.com/api/json/v1/1/";
  let endPoint = "";
  if (mealName) {
    endPoint = `search.php?s=${mealName}`;
  } else if (mealId) {
    endPoint = `lookup.php?i=${mealId}`;
  } else if (mealFirstLetter) {
    endPoint = `search.php?f=${mealFirstLetter}`;
  } else if (categories) {
    endPoint = `categories.php`;
  } else if (categoryName) {
    endPoint = `filter.php?c=${categoryName}`;
  } else if (areas) {
    endPoint = `list.php?a=list`;
  } else if (areaName) {
    endPoint = `filter.php?a=${areaName}`;
  } else if (ingredients) {
    endPoint = `list.php?i=list`;
  } else if (ingredientName) {
    endPoint = `filter.php?i=${ingredientName}`;
  }
  const response = await fetch(baseUrl + endPoint);
  const data = await response.json();
  return data;
}

async function mainData() {
  const data = await fetchData(" ");
  const uiMeals = uiDataMeals(data);
  $("main .meals").html(uiMeals);
  clickMealToShowDetails("main", "#mealDetails");
  $(".loading").fadeOut(1000);
}

function toggleTWoSections(showSectionName, hideSectionName) {
  $(showSectionName).addClass("d-none");
  $(hideSectionName).removeClass("d-none");
}

function clickMealToShowDetails(showSectionName, hideSectionName) {
  $(".meals .data").on("click", function () {
    showMealDetails($(this).children("img").attr("id"));
    toggleTWoSections(showSectionName, hideSectionName);
    hideNav();
  });
}

function clickCategoryToShowMeals() {
  $(".meals .data").on("click", function () {
    showCategoryMeals($(this).children("img").attr("id"));
    hideNav();
  });
}

function clickAreaToShowMeals() {
  $("#Area .data").on("click", function () {
    showAreaMeals($(this).children("h3").html());
    hideNav();
  });
}

function clickIngredientsToShowMeals(showSectionName, hideSectionName) {
  $("#Ingredients .data").on("click", function () {
    showIngredientsMeals($(this).children("h3").html());
    hideNav();
  });
}
async function showIngredientsMeals(ingredientName) {
  const meals = await fetchData(
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    ingredientName
  );
  const uiDataMeal = uiDataMeals(meals);
  $("#Ingredients .row").html(uiDataMeal);
  $(".loading").fadeOut(1000);
  clickMealToShowDetails("#Ingredients", "#mealDetails");
}

async function showAreaMeals(areaName) {
  const meals = await fetchData(null, null, null, null, null, null, areaName);
  const uiDataMeal = uiDataMeals(meals);
  $("#Area .row").html(uiDataMeal);
  clickMealToShowDetails("#Area", "#mealDetails");
}

async function showCategoryMeals(categoryName) {
  const meals = await fetchData(null, null, null, null, categoryName);
  const uiDataMeal = uiDataMeals(meals);
  $("#Categories .row").html(uiDataMeal);
  clickMealToShowDetails("#Categories", "#mealDetails");
}

async function showMealDetails(mealId) {
  const meal = await fetchData(null, mealId);
  const uiMealDetail = uiMealDetails(meal);
  $("#mealDetails .row").html(uiMealDetail);
}

function uiDataMeals(data) {
  let uiDataMeals = "";
  data.meals.forEach((meal) => {
    uiDataMeals += `<div class="meal col-md-3">
          <div class="data position-relative overflow-hidden rounded-2">
            <img id="${meal.idMeal}" src="${meal.strMealThumb}" class="w-100 rounded-2" alt="${meal.strMeal}" />
            <div class="overlay position-absolute w-100 h-100 top-100 rounded-3 d-flex align-items-center p-2 mb-0 h3 text-black">
                ${meal.strMeal}
            </div>
          </div>
        </div>`;
  });
  return uiDataMeals;
}

function uiMealDetails(data) {
  const meal = data.meals[0];
  const uiMealRecipes = getMealRecipes(meal);
  const mealTags = getMealTags(meal);
  let uiMealTags = "";
  if (mealTags) {
    uiMealTags = `<h3>Tags :</h3><ul class="list-unstyled d-flex flex-wrap g-3">${getMealTags(
      meal
    )}</ul>`;
  }

  let uiMealDetails = `<div class="col-md-4 h2"><img src="${meal.strMealThumb}" alt="" class="w-100 rounded-3"> ${meal.strMeal}</div>
      <div class="col-md-8">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3 class="fw-bolder">Area : ${meal.strArea}</h3>
        <h3>Category : ${meal.strCategory}</h3>
        <h3>Recipes :</h3>
        <ul class="list-unstyled d-flex flex-wrap g-3">
          ${uiMealRecipes}
        </ul>
        
        ${uiMealTags}
        <a href="${meal.strSource}" target="_blank" class="btn btn-success">Source</a>
        <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger">Youtube</a>
      </div>`;

  return uiMealDetails;
}

function uiMealsCategories(data) {
  let uiMealsCategories = "";
  if (data.categories) {
    data.categories.forEach((category) => {
      uiMealsCategories += `<div class="meal col-md-3">
          <div class="data position-relative overflow-hidden rounded-2 ">
            <img id="${category.strCategory}" src="${
        category.strCategoryThumb
      }" class="w-100 rounded-2" alt="${category.strCategory}" />
            <div class="overlay position-absolute w-100 h-100 top-100 rounded-3  text-center p-2 mb-0 overflow-hidden">
              <h3>${category.strCategory}</h3>
              <p>${category.strCategoryDescription.slice(0, 100)}...</p>
            </div>
          </div>
        </div>`;
    });
  }
  return uiMealsCategories;
}

function uiAreas(areas) {
  let uiAreas = "";
  if (areas.meals) {
    areas.meals.forEach((area) => {
      uiAreas += `<div class="col-md-3 border-0">
          <div class="data overflow-hidden text-center">
            <i class="fa-solid fa-house-laptop fa-4x"></i>
            <h3>${area.strArea}</h3>
          </div>
        </div>`;
    });
  }
  return uiAreas;
}

function uiIngredients(ingredients) {
  let uiIngredients = "";
  if (ingredients.meals) {
    const ingredient = ingredients.meals;
    for (let i = 0; i < 20; i++) {
      uiIngredients += `<div class="col-md-3 border-0">
          <div class="data overflow-hidden text-center">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <h3>${ingredient[i].strIngredient}</h3>
            <p>${ingredient[i].strDescription.slice(0, 100)}</p>
          </div>
        </div>`;
    }
  }
  return uiIngredients;
}

function getMealRecipes(meal) {
  // counter for Recipes
  let i = 1;
  let uiRecipes = ``;
  do {
    uiRecipes +=
      `<li class="m-2 p-1 alert alert-info">` +
      meal[`strMeasure${i}`] +
      " " +
      meal[`strIngredient${i}`] +
      "</li>";
    RecipeMeal = meal[`strIngredient${++i}`];
  } while (RecipeMeal);
  return uiRecipes;
}

function getMealTags(meal) {
  let tags = meal.strTags;
  if (tags) {
    let uiTags = ``;
    tags.split(",").forEach((tag) => {
      uiTags += `<li class="m-2 p-1 alert alert-danger">${tag}</li>`;
    });
    return uiTags;
  }
  return "";
}

$("#Search input").on("keyup", async function () {
  let searchKey = "";
  let data = "";
  let errorMessage = "";
  if ($(this).hasClass("sFirstLetter")) {
    searchKey = $(this).val() || "a";
    // if user enter multi chars set searchKey as first char
    if (searchKey.length > 1) {
      searchKey = searchKey[0];
    }
    data = await fetchData(null, null, searchKey);
    errorMessage = "No Valid Data.";
  } else if ($(this).hasClass("sName")) {
    searchKey = $(this).val() || " ";
    data = await fetchData(searchKey);
    errorMessage = "Enter a Valid Name.";
  }
  let dataMeals = "";
  if (data.meals) {
    dataMeals = uiDataMeals(data);
    $(this).next().addClass("d-none");
  } else {
    $(this).next().html(errorMessage).removeClass("d-none");
  }
  $("#Search .meals").html(dataMeals);
  clickMealToShowDetails("#Search", "#mealDetails");
});

async function Categories() {
  const data = await fetchData(null, null, null, true);
  const uiMealsCategory = uiMealsCategories(data);
  $("#Categories .meals").html(uiMealsCategory);
  clickCategoryToShowMeals("#Category", "#mealDetails");
}

async function Area() {
  const data = await fetchData(null, null, null, null, null, true);
  const uiArea = uiAreas(data);
  $("#Area .row").html(uiArea);
  clickAreaToShowMeals();
}

async function Ingredients() {
  const data = await fetchData(null, null, null, null, null, null, null, true);
  const uiIngredient = uiIngredients(data);
  $("#Ingredients .row").html(uiIngredient);
  clickIngredientsToShowMeals();
}

function testRegexInput(regex, value) {
  return regex.test(value);
}

function showAlert(element) {
  element.siblings("div").removeClass("d-none");
}

function hideAlert(element) {
  element.siblings("div").addClass("d-none");
}

function checkValidData(regex, input) {
  if (testRegexInput(regex, input.val().trim())) {
    hideAlert(input);
    return true;
  } else {
    showAlert(input);
    return false;
  }
}

function inputData(input) {
  if (input.hasClass("Name")) {
    validName = checkValidData(/^[a-zA-Z ]+$/, input);
  } else if (input.hasClass("Email")) {
    validEmail = checkValidData(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      input
    );
  } else if (input.hasClass("Phone")) {
    validPhone = checkValidData(/^01[0125][0-9]{8}$/, input);
  } else if (input.hasClass("Age")) {
    validAge = checkValidData(
      /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/,
      input
    );
  } else if (input.hasClass("Password")) {
    validPassword = checkValidData(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      input
    );
  } else if (input.hasClass("Repassword")) {
    if (input.val() == $("#ContactUs .Password").val()) {
      hideAlert(input);
      validRepassword = true;
    } else {
      showAlert(input);
      validRepassword = false;
    }
  }
}

let validName = false;
let validEmail = false;
let validPhone = false;
let validAge = false;
let validPassword = false;
let validRepassword = false;

function ContactUs() {
  // to check all input valid data
  $("#ContactUs input").on("keyup", function () {
    const input = $(this);
    inputData(input);
    if (
      validName &&
      validEmail &&
      validPhone &&
      validAge &&
      validPassword &&
      validRepassword
    ) {
      $("#ContactUs .btn").removeClass("disabled");
    } else {
      $("#ContactUs .btn").addClass("disabled");
    }
  });
}
