// ! utils
const getElement = (element, parentElement = document) =>
  parentElement.querySelector(element);

const fixDate = (time) => {
  let newDate = new Date(time);
  let fixedDate = "";
  fixedDate += newDate.getDate();
  fixedDate += `.${String(newDate.getMonth() + 1).padStart(2, "0")}.`;
  fixedDate += newDate.getFullYear();
  return fixedDate;
};

const createBenefitItem = (benefit, goingElement) => {
  const newBenefit = document.createElement("li");
  newBenefit.className = "badge bg-primary me-1 mb-1";
  newBenefit.textContent = benefit;
  goingElement.append(newBenefit);
};

// ! variables for dom node
const elTemplate = getElement(".template").content;
const elProductList = getElement(".card-list");
const elForm = getElement(".modal-form");
const elModalSelect = getElement("#product-manufacturer");
const elManufactureSelect = getElement(".form-select");
const $productCount = getElement(".count");

// ! rendering manufacture filter
const renderManufacturers = (manufacturers, goingElement) => {
  goingElement.innerHTML = null;
  goingElement.innerHTML = ' <option value="0">All</option>';

  const selectFragment = document.createDocumentFragment();
  manufacturers.forEach((product) => {
    const newOption = document.createElement("option");
    newOption.textContent = product.name;
    newOption.value = product.id;
    selectFragment.append(newOption);
  });
  goingElement.append(selectFragment);
};

renderManufacturers(manufacturers, elManufactureSelect);

// ! creating modal select option

const createModalOption = (manufacturers, goingElement) => {
  goingElement.innerHTML = null;
  goingElement.innerHTML =
    ' <option  selected disabled value="0">Select a manufacturer</option>';

  const modalFragment = document.createDocumentFragment();
  manufacturers.forEach((product) => {
    const modalOption = document.createElement("option");
    modalOption.value = product.id;
    modalOption.textContent = product.name;
    modalFragment.append(modalOption);
  });
  goingElement.append(modalFragment);
};

createModalOption(manufacturers, elModalSelect);

// ! rendering product card
const renderProduct = (products, goingElement) => {
  goingElement.innerHTML = null;
  const fragment = document.createDocumentFragment();
  // count
  $productCount.textContent = `count: ${products.length}`;

  products.forEach((product) => {
    const { id, title, img, price, model, addedDate, benefits } = product;
    const template = elTemplate.cloneNode(true);

    getElement(".card-list__item", template).setAttribute("data-id", id);
    template.querySelector(".card-img-top").src = img;
    template.querySelector(".card-title").textContent = title;
    template.querySelector(".card-text").textContent = price.toLocaleString(
      "es-ES",
      { style: "currency", currency: "UZS" }
    );
    template.querySelector(".product-name").textContent = model;
    template.querySelector(".product-date").textContent = fixDate(addedDate);
    benefits.forEach((benefit) => {
      createBenefitItem(benefit, template.querySelector(".benefit-list"));
    });

    fragment.append(template);
  });

  goingElement.append(fragment);
};

renderProduct(products, elProductList);

// const handleModal = (e) => {
// 		e.preventDefault()

// 		e.target.reset()
// }

// ! delete card function
const deleteCard = (event) => {
	if (event.target.matches('.btn__delete')) {
		const cardId = event.target.closest('.card-list__item').dataset.id
		const currentCard = products.findIndex(product => product.id === +cardId)
		products.splice(currentCard,1)
		renderProduct(products, elProductList);
		}
};

if (elProductList) {
  elProductList.addEventListener("click", deleteCard);
}

// elForm.addEventListener("submit", handleModal);
