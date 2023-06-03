// finding a order by order_id in shopify



async function findOrder() {
  const orderId = document.getElementById("orderId").value;
  const getOrderUrl = `https://gleaming-fox-housecoat.cyclic.app/findOrder?orderId=${orderId}`;
  try {
    let response = await fetch(getOrderUrl);
    response = await response.json();
    console.log(response)
    if (response.draft_order?.id) {
      alert("Order found and finding person with email");
      if (response.draft_order.email) {
        let personEmailId = response.draft_order.email;
        localStorage.setItem("personEmailId", JSON.stringify(personEmailId));
      }
      findPersonInPipedrive();
    } else {
      alert("Order is not found");
    }
  } catch (e) {
    console.log(e);
  }
}

// finding and creating a person in pipedrive

async function findPersonInPipedrive() {
  let personEmailId = localStorage.getItem("personEmailId");
  const findPersonUrl = `https://gleaming-fox-housecoat.cyclic.app/findPersonInPipedrive?email=${personEmailId}`;
  try {
    let response = await fetch(findPersonUrl);
    response = await response.json();
    if (response.data.items.length > 0) {
      alert("Person found");
      let foundPersonId = response.data.items[0].item.id;
      localStorage.setItem("foundPersonId", JSON.stringify(foundPersonId));
    } else {
      alert(
        "Person could not found please create person by entering fields below"
      );
    }
  } catch (e) {
    console.log(e);
  }
}

let personForm = document.getElementById("personForm");
personForm.addEventListener("submit", createPersonInPipedrive);

async function createPersonInPipedrive(e) {
  e.preventDefault();
  let data = {
    name: personForm.firstName.value + " " + personForm.lastName.value,
    email: personForm.email.value,
    phone: personForm.phone.value,
  };
  const createPersonUrl = `https://gleaming-fox-housecoat.cyclic.app/createPersonInPipedrive`;
  try {
    let response = await fetch(createPersonUrl, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    response = await response.json();
    if (response.data.id) {
      alert("Person created");
      let createdPersonId = response.data.id;
      localStorage.setItem("createdPersonId", JSON.stringify(createdPersonId));
    } else {
      alert("Person could not created");
    }
  } catch (e) {
    console.log(e);
  }
}

// find product and createProduct in pipedrive

async function findProductInPipedrive() {
  let code = document.getElementById("product").value;
  const findProductUrl = `https://gleaming-fox-housecoat.cyclic.app/findProductInPipedrive?term=${code}`;
  let foundProductDetails =
    JSON.parse(localStorage.getItem("foundProductDetails")) || [];
  try {
    let response = await fetch(findProductUrl);
    response = await response.json();
    if (response.data?.id) {
      alert("product found");
      foundProductDetails.push(
        response.data.id,
        response.data.unit,
        response.data.prices[0].price
      );
      localStorage.setItem(
        "foundProductDetails",
        JSON.stringify(foundProductDetails)
      );
    } else {
      alert("No product found please create product by entering fields below");
    }
  } catch (e) {
    console.log(e);
  }
}

let productForm = document.getElementById("productForm");
productForm.addEventListener("submit", createProductInPipedrive);

async function createProductInPipedrive(e) {
  e.preventDefault();
  let createdProductDetails =
    JSON.parse(localStorage.getItem("createdProductDetails")) || [];
  let data = {
    name: productForm.name.value,
    code: productForm.code.value,
    prices: [{ currency: "USD", price: productForm.prices.value }],
  };
  const createProductUrl = `https://gleaming-fox-housecoat.cyclic.app/createProductInPipedrive`;
  try {
    let response = await fetch(createProductUrl, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    response = await response.json();
    if (response.data.id) {
      alert("Product created");
      createdProductDetails.push(
        response.data.id,
        response.data.unit,
        response.data.prices[0].price
      );
      localStorage.setItem(
        "createdProductDetails",
        JSON.stringify(createdProductDetails)
      );
    } else {
      alert("product could not created");
    }
  } catch (e) {
    console.log(e);
  }
}

//create a deal in pipedrive

let dealForm = document.getElementById("dealForm");
dealForm.addEventListener("submit", createDealInPipedrive);

async function createDealInPipedrive(e) {
  e.preventDefault();
  const url = `https://gleaming-fox-housecoat.cyclic.app/createDealInPipedrive`;
  let createdPersonId = localStorage.getItem("createdPersonId");
  let foundPersonId = localStorage.getItem("foundPersonId");
  const data = {
    title: dealForm.title.value,
    value: dealForm.value.value,
    currency: "USD",
    person_id: foundPersonId || createdPersonId,
  };
  if(data.person_id){
    let response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    response = await response.json();
    if (response.data.id) {
      alert("Deal created and attaching product");
      let dealId = response.data.id;
      localStorage.setItem("dealId", JSON.stringify(dealId));
      attachProductToDealInPipedrive();
    } else {
      alert("Deal could not created");
    }
  }else{
    alert("Could not found personId, Please create a person")
  }
  
}

// attching a product to deal in pipedrive

async function attachProductToDealInPipedrive() {
  const url = `https://gleaming-fox-housecoat.cyclic.app/attachProductToDealInPipedrive`;
  let dealId = localStorage.getItem("dealId");
  let foundProductDetails = JSON.parse(
    localStorage.getItem("foundProductDetails")
  );
  let createdProductDetails = JSON.parse(
    localStorage.getItem("createdProductDetails")
  );

  if(foundProductDetails && createdProductDetails){
    let data = {
      dealId: Number(dealId),
      product_id: foundProductDetails[0] || createdProductDetails[0],
      item_price: foundProductDetails[2] || createdProductDetails[2],
      quantity:
        Number(foundProductDetails[1]) || Number(createdProductDetails[1]),
    };
    try {
      let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      response = await response.json();
      if (response.data.id) {
        alert("Product attached");
      } else {
        alert("Product could not attached");
      }
    } catch (e) {
      console.log(e);
    }
  }else{
    alert("Could not found product details, please add product")
  }
}
