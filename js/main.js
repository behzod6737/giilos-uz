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

const createBenefitItem = (benefit,  goingElement) => {
  const newBenefit = document.createElement("li");
  newBenefit.className = "badge bg-primary me-1 mb-1"
  newBenefit.textContent = benefit;
  goingElement.append(newBenefit);
};


const addNewBenefit = (benefit, goingElement) => {
  const newBenefit = document.createElement("li");
  const newBenefitBtn = document.createElement('button')
  newBenefit.className = 'me-1 mb-1'
  newBenefitBtn.className = 'btn btn-sm badge rounded-pill btn-danger'
  newBenefitBtn.textContent = benefit ;
  newBenefit.append(newBenefitBtn)
  goingElement.append(newBenefit);
};

// ! variables for dom node
const elFormFilter = getElement('.filter-form')
const elInputFilterName = getElement('.input-name__filter')

const elFormAdd = getElement('.add-form')
const  elFormAddName = getElement('.form-add-name')
const  elFormAddPrice = getElement('.form-add-price')
const  elFormAddBenefits = getElement('.form-add-benefits')
const elFormAddBenefitList =getElement('.benefits-list')

const elEditForm = getElement('.form-edit-modal')
const elEditFormName = getElement('.form-edit-name')
const elEditFormPrice = getElement('.form-edit-price')
const elEditFormSelect = getElement('.form-edit-select')
const elEditFormBenefit= getElement('.form-edit-benefit')


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
    modalOption.id = product.id;
	modalOption.value = product.name;
    modalOption.textContent = product.name.toUpperCase();
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
      "es-ES", { style: "currency", currency: "UZS" });
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

// ! filter product cards 

const filterProducts = (event) => {
	event.preventDefault()
	
	if (elInputFilterName.value.trim() === '') {
	 return	renderProduct(products, elProductList);
	}
	const regExp = new RegExp( elInputFilterName.value.trim(), 'gi')
	renderProduct(products.filter(product => product.title.match(regExp)), elProductList)
	event.target.reset()
	//  renderProduct(products.filter(product => product.title.toLowerCase().includes(elInputFilterName.value.toLowerCase().trim()), elProductList));
	
}


// ! add product cards
const addProductCard = (event) => {
	event.preventDefault()

	if (elFormAddName.value.trim()) {
	let [{img, ...rest}] = products
	let manufacturerNames = manufacturers.map(manufacturer => manufacturer.name)
	let selectedModal = manufacturerNames.filter(names =>  names.includes(elModalSelect.value))
	let allBenefits = elFormAddBenefits.value.split(',')
	
	allBenefits.forEach(benefit => {
		addNewBenefit(benefit, elFormAddBenefitList);
	})

	products.push({
		id: products[products.length -1].id +1,
		img,
		title:elFormAddName.value,
		model: selectedModal,
		addedDate:new Date().toISOString(),
		price:+elFormAddPrice.value,
		benefits:allBenefits
	});
		renderProduct(products, elProductList);

	}


	alert('rostan ham yangi product qoshmoqchimisiz?')
	event.target.reset()
}

// !edit and delete product

const editDeleteFunc = (e) => {
	if (e.target.matches('.btn__delete')) {
		const productId = e.target.closest('.card-list__item').dataset.id 
		const currentProduct = products.findIndex(product => product.id === +productId)
		products.splice(currentProduct,1)
		renderProduct(products, elProductList);

	}else if(e.target.matches('.btn-secondary')) {
		const productId = e.target.closest('.card-list__item').dataset.id 

		const currentProductIndex = products.findIndex(product => product.id === +productId)

		const {id,title,img,price,model,addedDate,benefits}= products[currentProductIndex]
		
		createModalOption(manufacturers,elEditFormSelect)

		elEditFormName.value = title
		elEditFormPrice.value = price
		elEditFormSelect.value = model
		elEditFormBenefit.value = benefits

		elEditForm.addEventListener('submit' , (e) => {
			e.preventDefault()
		
			if (elEditFormName.value.trim() && elEditFormPrice.value.trim()) {
				const arrBenefits = elEditFormBenefit.value.split(',')
				const editedProduct = {
					id,
					title:elEditFormName.value,
					img,
					price:+elEditFormPrice.value,
					model:elEditFormSelect.value,
					addedDate,
					benefits:arrBenefits
				}
				products.splice(currentProductIndex,1,editedProduct)
				renderProduct(products, elProductList);
			}
		})
	}
}


elProductList.addEventListener('click', editDeleteFunc)
elFormAdd.addEventListener('submit' , addProductCard )
elFormFilter.addEventListener('submit' , filterProducts)