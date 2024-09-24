
    let cartItems = {}; // To store cart items

    // Load data and cart from localStorage on page load
    document.addEventListener("DOMContentLoaded", function () {
        loadCartFromLocalStorage();
        // Fetch product data from JSON
        fetch("data.json")
            .then(response => response.json())
            .then(data => {
                displayProducts(data);
                loadCartFromLocalStorage(); // Load the cart after the products are displayed
            })
            .catch(error => console.error("Error fetching product data:", error));
    });

    // Display products on the page
    function displayProducts(products) {
        const foodSection = document.querySelector(".food-side");

        products.forEach((product, index) => {
            const productHTML = `
                <div class="food-con" data-index="${index}" data-name="${product.name}" data-price="${product.price}" data-category="${product.category}">
                    <div class="img-cart">
                        <img class"bordered" src="${product.image.desktop}" alt="${product.name}">
                        <div class="cart-container">
                            <button id="cart-btn-${index}" class="add-to-cart" onclick="toggleCartButtons(${index}, '${product.name}', ${product.price})">Add to Cart</button>
                            <div id="cart-quantity-${index}" class="cart-quantity hidden">
                                <span class="button" onclick="decreaseQuantity(${index})">-</span>
                                <span id="quantity-${index}">1</span>
                                <span class="button" onclick="increaseQuantity(${index})">+</span>
                            </div>
                        </div>
                    </div>
                    <span class="p-cart">${product.category}</span>
                    <span class="p-name">${product.name}</span>
                    <span class="price">$${product.price.toFixed(2)}</span>
                </div>
            `;
            foodSection.innerHTML += productHTML;

            // check if the product is already in the cart and update UI accordingly

            if (cartItems[index]) {
                document.getElementById(`cart-btn-${index}`).classList.add("hidden");
                document.getElementById(`cart-quantity-${index}`).classList.remove("hidden");
                document.getElementById(`quantity-${index}`).textContent = cartItems[index].quantity

                // Add the bordered class if quantity > 1 on page load
                // if (cartItems[index].quantity > 1) {
                    document.querySelector(`[data-index="${index}"] .img-cart img`).classList.add('bordered')
                // }
            }
        });
    }



    // Toggle the cart buttons and add item to the cart
    function toggleCartButtons(index, itemName, itemPrice) {
        document.getElementById(`cart-btn-${index}`).classList.add("hidden");
        document.getElementById(`cart-quantity-${index}`).classList.remove("hidden");

        if (!cartItems[index]) {
            const quantity = 1; // Start with quantity 1
            cartItems[index] = { name: itemName, price: itemPrice, quantity: quantity };
            document.getElementById(`quantity-${index}`).textContent = quantity;

            if (quantity >= 1) {
                document.querySelector(`[data-index="${index}"] .img-cart img`).classList.add('bordered')
                
            }
          
        }
        

        saveCartToLocalStorage();  // Save to localStorage
        updateCart();  // Update the cart UI
    }

    // Increase the quantity for a specific item
    function increaseQuantity(index) {
      if (cartItems[index]) {

          cartItems[index].quantity++;
          document.getElementById(`quantity-${index}`).textContent = cartItems[index].quantity;

          // Add 'bordered' class if quantity is greater than 1
          if (cartItems[index].quantity >= 1) {
            document.querySelector(`[data-index="${index}"] .img-cart img`).classList.add('bordered');
          }
          saveCartToLocalStorage();
          updateCart();
      }
    }

    // Decrease the quantity for a specific item
    function decreaseQuantity(index) {
        if (cartItems[index].quantity > 1) {
            cartItems[index].quantity--;
            document.getElementById(`quantity-${index}`).textContent = cartItems[index].quantity;
        } else {
            removeFromCart(index); // Remove if quantity is zero
        }
        // check am
        // if (cartItems[index] ) {
        //     document.getElementById(`quantity-${index}`).textContent = cartItems[index].quantity;
        // }
           // Remove 'bordered' class if quantity is 1 or less
           if (!cartItems[index] || cartItems[index].quantity < 1) {
               document.querySelector(`[data-index="${index}"] .img-cart img`).classList.remove('bordered')
           }

        saveCartToLocalStorage();
        updateCart();
    }

    // Add an item to the cart
    function addToCart(index, itemName, price, quantity) {
        if (!cartItems[index]) {
            cartItems[index] = { name: itemName, price: price, quantity: quantity };
        } else {
            cartItems[index].quantity += quantity;
        }

        saveCartToLocalStorage();
        updateCart();
    }

    // Remove an item from the cart
    function removeFromCart(index) {
      if (cartItems[index]) {

          delete cartItems[index];
          document.getElementById(`quantity-${index}`).textContent = 0;
          document.getElementById(`cart-btn-${index}`).classList.remove("hidden");
          document.getElementById(`cart-quantity-${index}`).classList.add("hidden");

 // Remove border when item is removed
    document.querySelector(`[data-index="${index}"] .img-cart img`).classList.remove('bordered');


          saveCartToLocalStorage();
          updateCart();
      }
    }

  

    // Update the cart UI and total price
    function updateCart() {
        const cartItemsContainer = document.getElementById("cart-items");
        const confirmOrderBtn = document.getElementById("confirm-order-btn");
        const carbonShow = document.getElementById("carbonShow");
        const carbonStuff = document.getElementById("carbon-stuff")
        
       

        cartItemsContainer.innerHTML = ""; // Clear current items
        let total = 0;
        let totalQuantity = 0; // Variable to track total quantity of all items

        // checking if cartItems is empty
        if (Object.keys(cartItems).length === 0) {
            // if the cart is empty, show the empty cart message with an image
            cartItemsContainer.innerHTML = `
            <div class="empty-cart">
             <img src="/images/illustration-empty-cart.svg">
             <p>Your added items will appear hear</p>
            </div>
            `;
            // confirmOrderBtn.style.display = "none";
            // carbonShow.style.display = "none";
           
            
            // return;
        }

        for (const index in cartItems) {
            const item = cartItems[index];
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            totalQuantity += item.quantity; // Add the item's quantity to the total quantity

            // Create the cart item element
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <span class="cartName">${item.name}</span>
                <div class="item-quant">
                   <div>
                   <span class="sQuant">${item.quantity} x </span>
                   <span class="pQuant">@$${item.price.toFixed(2)} =</span>
                   <span class="iQuant">$${itemTotal.toFixed(2)}</span>
                   </div>
                    <span class="remove-btn" onclick="removeFromCart(${index})">Remove</span>
                </div>
            `;

            cartItemsContainer.appendChild(cartItem);
        }

      


        // Update total price in the cart summary
        document.getElementById("cart-total").textContent = total.toFixed(2);

        // Update the total quantity in the "Your Cart" header
        document.getElementById("total-quantity").textContent = totalQuantity;

        // show or hide the confirm order button based on cart status
        if (totalQuantity > 0) {
            confirmOrderBtn.style.display = "block";
        } else {
            confirmOrderBtn.style.display = 'none';
        }
        // Show the carbon writeUp
        if (totalQuantity > 3) {
            carbonStuff.style.display = "block";
        } else {
            carbonStuff.style.display = 'none';
        }
    }
     
   

    // Save cart to localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    // Load cart from localStorage
    function loadCartFromLocalStorage() {
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
            cartItems = JSON.parse(storedCart);
            updateCart();  // Update the cart display with the loaded data

            // Restore borders for items the quantity >= 1 after page load
            // for (const index in cartItems) {
            //     if (cartItems[index].quantity >= 1) {
            //         document.querySelector(`[data-index="${index}"] .img-cart img`).classList.add('bordered')
            //     }
            // }
        }
    }






// Show the order modal with order details
document.getElementById('confirm-order-btn').addEventListener('click', function() {
    const orderDetails = document.getElementById('order-details');
    orderDetails.innerHTML = ''; // Clear any previous order details
    let modalTotal = 0 
    

    for (const index in cartItems) {
        const item = cartItems[index];
        const modalItem = item.price * item.quantity;
        modalTotal += modalItem

        
        
        // Create the order item details
        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item');

        const productImage = document.querySelector(`[data-index="${index}"] .img-cart img`).src;
        orderItem.innerHTML = `
           <div class="modal-popUp">
           
           <img src="${productImage}" alt="${item.name}">
           <div class="modal-item">
           <h5>${item.name}</h5>
           <div>
           <span class="sQuant">${item.quantity}x </span>
           <span class="pQuant">@$${item.price.toFixed(2)}</span>
           </div>
           </div>
           
             
             <span class=" mItemTotal">$${modalItem.toFixed(2)}</span>
           
           
           </div>
           `;

        orderDetails.appendChild(orderItem);
    };

    // update modal total 
    const totalElement = document.createElement('div');
    totalElement.classList.add('modal-total');
    totalElement.innerHTML =`
    <div class="modalTotal">
    <span>Modal Total: $</span><h4 id="modal-total">$${modalTotal.toFixed(2)}</h4>
    </div>
    `;
    orderDetails.appendChild(totalElement);
 
    // Show the modal
    document.getElementById('order-modal').classList.remove('noShow');
    // Show overlay
    document.getElementById('modal-overlay').classList.remove('noLay')
});

// Close the modal when "Continue Shopping" button is clicked
document.getElementById('continue-shopping-btn').addEventListener('click', function() {
    closeModal();
})

// Close the modal when clicking outside of it (on the overlay)
document.getElementById('modal-overlay').addEventListener('click', function() {
    closeModal();
});

// Function to close the modal
function closeModal() {
    document.getElementById('order-modal').classList.add('noShow');
    document.getElementById('modal-overlay').classList.add('noLay');
}






// Start a new order
document.getElementById('new-order-btn').addEventListener('click', function() {
    // Clear the cart
    cartItems = {};
    saveCartToLocalStorage(); // Update local storage
    updateCart(); // Refresh the cart UI

    // reset all product UI element (quantity and "Add to Cart" buttons)
    resetProductUI()

    // Close the modal
    document.getElementById('order-modal').classList.add('noShow');
});

// Function to reset product UI element after starting a new order
function resetProductUI() {
    const productElements = document.querySelectorAll('.food-con');

    productElements.forEach(product => {
        const index = product.getAttribute('data-index');

        // Reset "Add to Cart" button visibility
        document.getElementById(`cart-btn-${index}`).classList.remove('hidden');
        document.getElementById(`cart-quantity-${index}`).classList.add('hidden');

        // Reset the quantity to 1
        document.getElementById(`quantity-${index}`).textContent = 1;

        // Remove the 'bordered' class from product images
        const productImage = document.querySelector(`[data-index="${index}"] .img-cart img`);
        productImage.classList.remove('bordered');
    });
}

