import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Inicializa Supabase
const supabase = createClient(
    'https://ogtbjqbvfmnlvkucqutj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ndGJqcWJ2Zm1ubHZrdWNxdXRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNzM1NTYyMSwiZXhwIjoyMDMyOTMxNjIxfQ.1uP3YbHw5HSLkoPOVZOjeYhgYZ88fK20S6RWQR_QIIE'
);


const productListMVendidos = document.getElementById('productListMVendidos');
const productListEnOferta = document.getElementById('productListEnOferta');
const productListCategoria = document.getElementById('productListCarnicos');

// Lista de productos más vendidos
const fetchProducts = async () => {
    try {
        const { data, error } = await supabase
            .from('Productos de Tienda de Comestibles') // Nombre de la tabla
            .select('*') // Selecciona todos los campos
            .order('Ventas', {ascending: false})
            .limit(12);

        if (error) {
            console.error('Error fetching products:', error);
        } else {
            displayProducts(data);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const displayProducts = (products) => {
    productListMVendidos.innerHTML = ''; // Limpia la lista anterior

    products.forEach((product, index) => { // Agrega 'index' para usar el índice
        const colElement = document.createElement('div');
        colElement.classList.add('col');

        colElement.innerHTML = `
      <div class="card product-card h-100 bg-transparent border-0 shadow-none">
        <div class="position-relative z-2">
          <button type="button"
            class="btn btn-icon btn-sm btn-secondary animate-pulse fs-sm bg-body border-0 position-absolute top-0 end-0 z-2 mt-1 mt-sm-2 me-1 me-sm-2"
            aria-label="Add to Wishlist">
            <i class="ci-heart animate-target"></i>
          </button>
          <a class="d-block p-2 p-lg-3" 
             href="shop-product-grocery.html?productId=${product.Id}">  
            <div class="ratio" style="--cz-aspect-ratio: calc(160 / 191 * 100%)">
              <img src="${product.Foto1}" alt="Image"> 
            </div>
          </a>
          <div class="position-absolute w-100 start-0 bottom-0">
            <div class="d-flex justify-content-end px-2 px-lg-3 pb-2 pb-lg-3">
              <div
                class="count-input count-input-collapsible collapsed justify-content-between w-100 bg-transparent border-0 rounded-2">
                <button type="button" class="btn btn-icon btn-sm btn-primary" data-decrement=""
                  aria-label="Decrement quantity">
                  <i class="ci-minus fs-sm"></i>
                </button>
                <input type="number" class="form-control form-control-sm bg-primary text-white w-100" value="0"
                  min="0" readonly="">
                <button type="button" class="product-card-button btn btn-icon btn-sm btn-secondary ms-auto"
                  data-increment="" aria-label="Increment quantity">
                  <span data-count-input-value=""></span>
                  <i class="ci-plus fs-sm"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body pt-0 px-1 px-md-2 px-lg-3 pb-2">
          <div class="h6 mb-2">$${product.PrecioCUP}</div>
          <h3 class="fs-sm lh-base mb-0">
            <a class="hover-effect-underline fw-normal" href="#">${product.Nombre}</a>
          </h3>
        </div>
        <div class="fs-xs text-body-secondary px-1 px-md-2 px-lg-3 pb-2 pb-md-3">Ventas: ${product.Ventas}</div>
      </div>
    `;

        productListMVendidos.appendChild(colElement);
    });
};

fetchProducts();



// Lista de productos en oferta
const fetchProductsEnOferta = async () => {
  try {
      const { data, error } = await supabase
          .from('Productos de Tienda de Comestibles') // Nombre de la tabla
          .select('*') // Selecciona todos los campos
          .limit(4);

      if (error) {
          console.error('Error fetching products:', error);
      } else {
          displayProductsEnOferta(data);
      }
  } catch (error) {
      console.error('Error fetching products:', error);
  }
};

const displayProductsEnOferta = (products) => {
  productListEnOferta.innerHTML = ''; // Limpia la lista anterior

  products.forEach((product, index) => { // Agrega 'index' para usar el índice
      const colElement = document.createElement('div');
      colElement.classList.add('col');

      colElement.innerHTML = `
              <div class="swiper-slide h-auto">
                <div class="card product-card h-100 bg-transparent border-0 shadow-none">
                  <div class="position-relative z-2">
                    <button type="button"
                      class="btn btn-icon btn-sm btn-secondary animate-pulse fs-sm bg-body border-0 position-absolute top-0 end-0 z-2 mt-1 mt-sm-2 me-1 me-sm-2"
                      aria-label="Add to Wishlist">
                      <i class="ci-heart animate-target"></i>
                    </button>
                    <a class="d-block p-2 p-lg-3" href="shop-product-grocery.html?productId=${product.Id}">
                      <div class="ratio" style="--cz-aspect-ratio: calc(160 / 191 * 100%)">
                        <img src="${product.Foto1}" alt="Image">
                      </div>
                    </a>
                    <div class="position-absolute w-100 start-0 bottom-0">
                      <div class="d-flex justify-content-end px-2 px-lg-3 pb-2 pb-lg-3">
                        <div
                          class="count-input count-input-collapsible collapsed justify-content-between w-100 bg-transparent border-0 rounded-2">
                          <button type="button" class="btn btn-icon btn-sm btn-primary" data-decrement=""
                            aria-label="Decrement quantity">
                            <i class="ci-minus fs-sm"></i>
                          </button>
                          <input type="number" class="form-control form-control-sm bg-primary text-white w-100"
                            value="0" min="0" readonly="">
                          <button type="button" class="product-card-button btn btn-icon btn-sm btn-secondary ms-auto"
                            data-increment="" aria-label="Increment quantity">
                            <span data-count-input-value=""></span>
                            <i class="ci-plus fs-sm"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-body pt-0 px-1 px-md-2 px-lg-3 pb-2">
                    <div class="h6 mb-2">$${product.PrecioCUP}</div>
                    <h3 class="fs-sm lh-base mb-0">
                      <a class="hover-effect-underline fw-normal" href="shop-product-grocery.html">${product.Nombre}</a>
                    </h3>
                  </div>
                  <div class="fs-xs text-body-secondary px-1 px-md-2 px-lg-3 pb-2 pb-md-3">${product.Cantidad}</div>
                </div>
              </div>
  `;

  productListEnOferta.appendChild(colElement);
  });
};

fetchProductsEnOferta();




// Lista de productos por categorías
const fetchProductsCategoria = async () => {
  try {
      const { data, error } = await supabase
          .from('Productos de Tienda de Comestibles') // Nombre de la tabla
          .select('*') // Selecciona todos los campos
          .limit(4);

      if (error) {
          console.error('Error fetching products:', error);
      } else {
          displayProductsCategoria(data);
      }
  } catch (error) {
      console.error('Error fetching products:', error);
  }
};

const displayProductsCategoria = (products) => {
  productListCategoria.innerHTML = ''; // Limpia la lista anterior

  products.forEach((product, index) => { // Agrega 'index' para usar el índice
      const colElement = document.createElement('div');
      colElement.classList.add('col');

      colElement.innerHTML = `
              <!-- Product -->
              <div class="swiper-slide h-auto">
                <div class="card product-card h-100 bg-transparent border-0 shadow-none">
                  <div class="position-relative z-2">
                    <button type="button"
                      class="btn btn-icon btn-sm btn-secondary animate-pulse fs-sm bg-body border-0 position-absolute top-0 end-0 z-2 mt-1 mt-sm-2 me-1 me-sm-2"
                      aria-label="Add to Wishlist">
                      <i class="ci-heart animate-target"></i>
                    </button>
                    <a class="d-block p-2 p-lg-3" href="shop-product-grocery.html">
                      <div class="ratio" style="--cz-aspect-ratio: calc(160 / 191 * 100%)">
                        <img src="${product.Foto1}" alt="Image">
                      </div>
                    </a>
                    <div class="position-absolute w-100 start-0 bottom-0">
                      <div class="d-flex justify-content-end px-2 px-lg-3 pb-2 pb-lg-3">
                        <div
                          class="count-input count-input-collapsible collapsed justify-content-between w-100 bg-transparent border-0 rounded-2">
                          <button type="button" class="btn btn-icon btn-sm btn-primary" data-decrement=""
                            aria-label="Decrement quantity">
                            <i class="ci-minus fs-sm"></i>
                          </button>
                          <input type="number" class="form-control form-control-sm bg-primary text-white w-100"
                            value="0" min="0" readonly="">
                          <button type="button" class="product-card-button btn btn-icon btn-sm btn-secondary ms-auto"
                            data-increment="" aria-label="Increment quantity">
                            <span data-count-input-value=""></span>
                            <i class="ci-plus fs-sm"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-body pt-0 px-1 px-md-2 px-lg-3 pb-2">
                    <div class="h6 mb-2">$${product.PrecioCUP}</div>
                    <h3 class="fs-sm lh-base mb-0">
                      <a class="hover-effect-underline fw-normal" href="shop-product-grocery.html">${product.Nombre}</a>
                    </h3>
                  </div>
                  <div class="fs-xs text-body-secondary px-1 px-md-2 px-lg-3 pb-2 pb-md-3">${product.Cantidad}</div>
                </div>
              </div>
  `;

  productListCategoria.appendChild(colElement);
  });
};

fetchProductsCategoria();




