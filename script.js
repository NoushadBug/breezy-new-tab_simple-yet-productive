document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const modalInput = document.getElementById("modal-input");
    const modalUrlInput = document.getElementById("modal-url");
    const modalTitle = document.getElementById("modal-title");
    const modalClose = document.getElementById("modal-close");
    const modalSubmit = document.getElementById("modal-submit");
    const categoriesContainer = document.getElementById("categories");

    let categories = JSON.parse(localStorage.getItem("categories")) || [];

    const renderCategories = () => {
        categoriesContainer.innerHTML = "";
        categories.forEach((category, categoryIndex) => {
            const categoryElement = createCategoryElement(category, categoryIndex);
            categoriesContainer.append(categoryElement);
        });
    };

    const createCategoryElement = (category, categoryIndex) => {
        const categoryElement = document.createElement("div");
        categoryElement.classList.add("category", "p-4", "bg-gray-800", "rounded", "space-y-4");

        const header = createCategoryHeader(category, categoryIndex);
        const linksContainer = createLinksContainer(category.links, categoryIndex);

        const addLinkButton = document.createElement("button");
        addLinkButton.innerHTML = "<i class='bx bx-plus'></i>"; // Boxicon for Add Link
        addLinkButton.classList.add("hover:bg-blue-700", "text-white", "font-bold", "p-2", "rounded", "mt-4");
        addLinkButton.onclick = () => showModal("Add Link", categoryIndex);

        categoryElement.append(header, linksContainer, addLinkButton);
        return categoryElement;
    };

    const createCategoryHeader = (category, categoryIndex) => {
        const header = document.createElement("div");
        header.classList.add("flex", "justify-between", "items-center");

        const title = document.createElement("h2");
        title.classList.add("text-xl", "font-bold");
        title.textContent = category.name;

        const headerButtons = createHeaderButtons(categoryIndex);
        header.append(title, headerButtons);
        return header;
    };

    const createHeaderButtons = (categoryIndex) => {
        const headerButtons = document.createElement("div");

        const renameButton = createButtonWithIcon("bx-pencil", "Rename Category", () => {
            showModal("Rename Category", categoryIndex);
            modalInput.value = categories[categoryIndex].name;
        });

        const deleteButton = createButtonWithIcon("bx-trash", "Delete Category", () => {
            categories.splice(categoryIndex, 1);
            saveCategories();
        });

        headerButtons.append(renameButton, deleteButton);
        return headerButtons;
    };

    const createButtonWithIcon = (iconClass, title, onClick) => {
        const button = document.createElement("button");
        button.innerHTML = `<i class='bx ${iconClass}'></i>`; // Boxicon for action
        button.classList.add("hover:bg-yellow-700", "text-white", "font-bold", "p-1", "ml-2", "rounded");
        button.title = title;
        button.onclick = onClick;
        return button;
    };

    const createLinksContainer = (links, categoryIndex) => {
        const linksContainer = document.createElement("div");
        linksContainer.classList.add("grid", "grid-cols-3", "gap-4");

        links.forEach((link, linkIndex) => {
            const linkElement = createLinkElement(link, categoryIndex, linkIndex);
            linksContainer.append(linkElement);
        });

        return linksContainer;
    };

    const createLinkElement = (link, categoryIndex, linkIndex) => {
        const linkElement = document.createElement("div");
        linkElement.classList.add("link", "bg-gray-700", "p-3", "rounded", "flex", "justify-between", "items-center");

        const linkText = document.createElement("a");
        linkText.href = link.url;
        linkText.textContent = link.name;
        linkText.classList.add("text-blue-400", "hover:underline");

        const linkDeleteButton = createButtonWithIcon("bx-x", "Delete Link", () => {
            categories[categoryIndex].links.splice(linkIndex, 1);
            saveCategories();
        });

        linkElement.append(linkText, linkDeleteButton);
        return linkElement;
    };

    const showModal = (title, categoryIndex) => {
        modalTitle.textContent = title;
        modalInput.value = title === "Add Link" ? "" : categories[categoryIndex].name;
        modalUrlInput.value = "";
        modalUrlInput.style.display = title === "Add Link" ? "block" : "none";
        modal.style.display = "block";
        modalInput.focus();
    };

    const saveCategories = () => {
        localStorage.setItem("categories", JSON.stringify(categories));
        renderCategories();
        modal.style.display = "none"; // Hide modal after submission
    };

    modalSubmit.onclick = () => {
        if (modalTitle.textContent === "Add Category") {
            categories.push({ name: modalInput.value, links: [] });
        } else if (modalTitle.textContent === "Rename Category") {
            const index = categories.findIndex(cat => cat.name === modalInput.dataset.name);
            if (index !== -1) {
                categories[index].name = modalInput.value;
            }
        } else if (modalTitle.textContent === "Add Link") {
            const index = modalInput.dataset.index;
            const newLink = { name: modalInput.value, url: modalUrlInput.value };
            categories[index].links.push(newLink);
        }
        saveCategories();
    };

    modalClose.onclick = () => {
        modal.style.display = "none"; // Hide modal on close
    };

    document.getElementById('addCategory').onclick = () => showModal("Add Category");

    renderCategories();
});
