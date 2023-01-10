//Ajout des elements de travail dynamiques
fetch("http://localhost:5678/api/works")
  .then((res) => res.json())
  .then((arrayWorks) => {
    createWork(arrayWorks);
  });

fetch("http://localhost:5678/api/categories")
  .then((res) => res.json())
  .then((arrayFilter) => {
    createFilter(arrayFilter);
  });

const createWork = (array) => {
  array.forEach((element) => {
    let figure = document.createElement("figure");
    figure.setAttribute("data-id", element.id);
    figure.setAttribute("data-filter", element.category.id);
    figure.classList.add("cards");
    document.querySelector(".gallery").appendChild(figure);
    let img = document.createElement("img");
    img.src = element.imageUrl;
    img.crossOrigin = "anonymous";
    figure.appendChild(img);
    let figcaption = document.createElement("figcaption");
    figcaption.innerHTML = element.title;
    figure.appendChild(figcaption);
  });
};

const createFilter = (array) => {
  array.forEach((element) => {
    let filterContainer = document.querySelector(".filters");
    let filter = document.createElement("button");
    filter.innerHTML = element.name;
    filter.classList.add("filter");
    filter.setAttribute("data-filter", element.id);
    filterContainer.appendChild(filter);
  });
  const buttons = document.querySelectorAll("button.filter");
  buttons.forEach((button) => {
    button.addEventListener("click", filterCategory);
    button.addEventListener("click", () => {
      document.querySelector(".active").classList.remove("active");
      button.classList.add("active");
    });
  });
};

const filterCategory = (event) => {
  let dataFilter = event.target.getAttribute("data-filter");
  let figures = document.querySelectorAll(".cards");

  if (dataFilter === "0") {
    figures.forEach((figure) => figure.classList.remove("hide"));
  } else {
    figures.forEach((figure) => {
      if (figure.getAttribute("data-filter") === dataFilter) {
        figure.classList.remove("hide");
      } else {
        figure.classList.add("hide");
      }
    });
  }
};
//Fin des ajouts

//Login
try {
  const form = document.querySelector("#signInForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailValue = document.querySelector("#email").value;
    const passwordValue = document.querySelector("#password").value;
    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailValue,
        password: passwordValue,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.userId) {
          let error = document.querySelector(".error");
          error.innerText = "Erreur dans l’identifiant ou le mot de passe";
        } else {
          login(data);
        }
      })
      .catch((err) => {});
  });
} catch (error) {}

let login = (datas) => {
  localStorage.setItem("token", datas.token);
  localStorage.setItem("userId", datas.userId);
  document.location.href = "index.html";
};

if (localStorage.length > 0) {
  let log = document.querySelector("#log");
  let login = document.querySelector(".login");
  let logout = document.createElement("a");
  let editor = document.querySelector(".editor");
  let edit = document.querySelectorAll(".edit.hide");

  log.removeChild(login);
  logout.innerText = "logout";
  logout.classList.add("logout");
  log.appendChild(logout);
  editor.classList.remove("hide");
  for (let i = 0; i < edit.length; i++) {
    edit[i].classList.remove("hide");
  }

  logout.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    log.removeChild(logout);
    log.appendChild(login);
    editor.classList.add("hide");
    for (let i = 0; i < edit.length; i++) {
      edit[i].classList.add("hide");
    }
  });
}
//Login fin

//Modal window ouverture/fermeture
const edit = document.querySelectorAll(".edit");
const modal = document.querySelector(".modal");
const xMark = document.querySelectorAll(".fa-solid.fa-xmark");
const modalBackground = document.querySelector(".modalBackground");

for (let i = 0; i < edit.length; i++) {
  edit[i].addEventListener("click", () => {
    modal.classList.remove("hide");
  });
}

for (let i = 0; i < xMark.length; i++) {
  xMark[i].addEventListener("click", () => {
    modal.classList.add("hide");
  });
}

modalBackground.addEventListener("click", () => {
  modal.classList.add("hide");
});

//Modal window ouverture/fermeture fin

//import images dans le modal
fetch("http://localhost:5678/api/works")
  .then((res) => res.json())
  .then((modalImage) => {
    imageDisplay(modalImage);
  });

let imageDisplay = (data) => {
  data.forEach((element) => {
    createNewImageInModal(element);
  });
  let figure = document.querySelector(".modalGalleryContent figure");
  let arrowUpDownLeftRight = document.createElement("div");
  arrowUpDownLeftRight.classList.add("arrowUpDownLeftRight");
  arrowUpDownLeftRight.innerHTML =
    '<i class="fa-solid fa-arrows-up-down-left-right"></i>';
  figure.appendChild(arrowUpDownLeftRight);
};
//import images dans le modal fin

//suppression image à partir du formulaire
const OnTrashClick = (event) => {
  let parentTrash = event.target.closest("[data-id]");
  fetch(
    "http://localhost:5678/api/works/" + parentTrash.getAttribute("data-id"),
    {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  ).then(() => {
    let galleryFigure = document.querySelectorAll(".gallery figure");
    let modalGalleryFigure = document.querySelectorAll(
      ".modalGalleryContent figure"
    );
    for (let i = 0; i < galleryFigure.length; i++) {
      let figure = galleryFigure[i];
      if (
        figure.getAttribute("data-id") === parentTrash.getAttribute("data-id")
      ) {
        figure.remove();
      }
    }
    for (let i = 0; i < modalGalleryFigure.length; i++) {
      let modalFigure = modalGalleryFigure[i];
      if (
        modalFigure.getAttribute("data-id") ===
        parentTrash.getAttribute("data-id")
      ) {
        modalFigure.remove();
      }
    }
  });
};
//suppression image à partir du formulaire fin

//passer de la galerie à l'ajout d'une image
const slideContainer = document.querySelector(".galleryAndAdd");
const picAdd = document.querySelector(".picAdd");
const arrowLeft = document.querySelector(".fa-solid.fa-arrow-left");

picAdd.addEventListener("click", () => {
  slideContainer.scrollLeft += 630;
});

arrowLeft.addEventListener("click", () => {
  slideContainer.scrollLeft -= 630;
});
//passer de la galerie à l'ajout d'une image fin

//ajouter une image à partir du formulaire
const addButton = document.querySelector("#addButton");
const addNewImage = document.querySelector("#addNewImage");

addButton.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    let src = URL.createObjectURL(e.target.files[0]);
    const imgPreview = document.querySelector("#imgPreview");
    imgPreview.src = src;
    imgPreview.style.display = "block";
    let addButtonV = document.querySelector(".addButton");
    addButtonV.style.display = "none";
    addNewImage.addEventListener("submit", () => {
      src = URL.revokeObjectURL(e.target.files[0]);
      imgPreview.style.display = "none";
      addButtonV.style.display = "block";
      addNewImage.reset();
      slideContainer.scrollLeft -= 630;
    });
  }
});

addNewImage.addEventListener("submit", (e) => {
  e.preventDefault();
  const addNewImage = document.querySelector("#addNewImage");
  let formData = new FormData(addNewImage);
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      createNewImage(data);
      createNewImageInModal(data);
    });
});

const createNewImage = (datas) => {
  let figure = document.createElement("figure");
  figure.setAttribute("data-id", datas.id);
  figure.setAttribute("data-filter", datas.categoryId);
  figure.classList.add("cards");
  document.querySelector(".gallery").appendChild(figure);
  let img = document.createElement("img");
  img.src = datas.imageUrl;
  img.crossOrigin = "anonymous";
  figure.appendChild(img);
  let figcaption = document.createElement("figcaption");
  figcaption.innerHTML = datas.title;
  figure.appendChild(figcaption);
};

const createNewImageInModal = (datas) => {
  let figure = document.createElement("figure");
  figure.setAttribute("data-id", datas.id);
  document.querySelector(".modalGalleryContent").appendChild(figure);
  let img = document.createElement("img");
  img.src = datas.imageUrl;
  img.crossOrigin = "anonymous";
  figure.appendChild(img);
  let figcaption = document.createElement("figcaption");
  figcaption.innerText = "éditer";
  figure.appendChild(figcaption);
  let div = document.createElement("div");
  div.classList.add("trash");
  div.addEventListener("click", OnTrashClick);
  div.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
  figure.appendChild(div);
};
//ajouter une image à partir du formulaire fin