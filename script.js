/* =========================================================
   NERO PROJECT
   JavaScript
========================================================= */


/* =========================================================
   VARIABLES
========================================================= */

const header = document.querySelector(".header");

const menuButton = document.querySelector("#menu-button");

const nav = document.querySelector("#nav");

const navLinks = document.querySelectorAll(".nav-link");

const contactForm = document.querySelector("#contact-form");

const formMessage = document.querySelector("#form-message");


/* =========================================================
   HEADER AL HACER SCROLL
========================================================= */

function updateHeader() {

    if (!header) {
        return;
    }

    if (window.scrollY > 80) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }
}

window.addEventListener("scroll", updateHeader);

updateHeader();


/* =========================================================
   MENÚ MOBILE
========================================================= */

function openMenu() {

    if (!nav || !menuButton) {
        return;
    }

    nav.classList.toggle("open");

    menuButton.classList.toggle("active");

    document.body.classList.toggle("menu-open");

    const isOpen =
        nav.classList.contains("open");


    menuButton.setAttribute(
        "aria-expanded",
        isOpen
    );

    menuButton.setAttribute(
        "aria-label",
        isOpen
            ? "Cerrar menú"
            : "Abrir menú"
    );
}


if (menuButton) {

    menuButton.addEventListener(
        "click",
        openMenu
    );

}


/* =========================================================
   CERRAR MENÚ AL HACER CLICK
========================================================= */

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        if (!nav || !menuButton) {
            return;
        }

        nav.classList.remove("open");

        menuButton.classList.remove("active");

        document.body.classList.remove(
            "menu-open"
        );

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.setAttribute(
            "aria-label",
            "Abrir menú"
        );

    });

});


/* =========================================================
   ESC PARA CERRAR MENÚ
========================================================= */

document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        nav &&
        nav.classList.contains("open")
    ) {

        nav.classList.remove("open");

        if (menuButton) {

            menuButton.classList.remove(
                "active"
            );

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.setAttribute(
                "aria-label",
                "Abrir menú"
            );

        }

        document.body.classList.remove(
            "menu-open"
        );

    }

});


/* =========================================================
   SCROLL SUAVE
========================================================= */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(link => {

    link.addEventListener("click", event => {

        const targetId =
            link.getAttribute("href");


        if (
            !targetId ||
            targetId === "#"
        ) {
            return;
        }


        const target =
            document.querySelector(targetId);


        if (!target) {
            return;
        }


        event.preventDefault();


        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* =========================================================
   REVEAL ANIMATION
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".section-number, .intro-grid, .portfolio-card, .service, .statement-container, .contact-grid"
    );


revealElements.forEach(element => {

    element.classList.add("reveal");

});


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(element => {

        revealObserver.observe(element);

    });

} else {

    /* Si el navegador no soporta
       IntersectionObserver */

    revealElements.forEach(element => {

        element.classList.add("visible");

    });

}


/* =========================================================
   NAVEGACIÓN ACTIVA
========================================================= */

const sections =
    document.querySelectorAll(
        "section[id]"
    );


function updateActiveLink() {

    if (!navLinks.length) {
        return;
    }


    let currentSection = "";


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 180;

        const sectionHeight =
            section.offsetHeight;


        if (
            window.scrollY >= sectionTop &&
            window.scrollY <
            sectionTop + sectionHeight
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");


        const href =
            link.getAttribute("href");


        if (
            href === `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveLink
);

updateActiveLink();


/* =========================================================
   FORMULARIO DE CONTACTO
   FORMSPREE
========================================================= */

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async event => {

            /*
             * Evitamos que el navegador
             * recargue la página.
             */

            event.preventDefault();


            /* =========================
               ELEMENTOS DEL FORMULARIO
            ========================== */

            const nombre =
                document.querySelector(
                    "#nombre"
                )?.value.trim() || "";


            const email =
                document.querySelector(
                    "#email"
                )?.value.trim() || "";


            const mensaje =
                document.querySelector(
                    "#mensaje"
                )?.value.trim() || "";


            /* =========================
               VALIDACIÓN
            ========================== */

            if (
                nombre === "" ||
                email === "" ||
                mensaje === ""
            ) {

                if (formMessage) {

                    formMessage.textContent =
                        "Por favor, completa todos los campos obligatorios.";

                    formMessage.className =
                        "form-message error";

                }

                return;
            }


            /* =========================
               VALIDAR EMAIL
            ========================== */

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailRegex.test(email)) {

                if (formMessage) {

                    formMessage.textContent =
                        "Ingresa un correo electrónico válido.";

                    formMessage.className =
                        "form-message error";

                }

                return;
            }


            /* =========================
               BOTÓN DE ENVÍO
            ========================== */

            const submitButton =
                contactForm.querySelector(
                    ".submit-button"
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.innerHTML =
                    'Enviando... <span>↗</span>';

            }


            /* =========================
               ENVIAR A FORMSPREE
            ========================== */

            try {

                const response =
                    await fetch(
                        contactForm.action,
                        {
                            method: "POST",

                            body:
                                new FormData(
                                    contactForm
                                ),

                            headers: {
                                "Accept":
                                    "application/json"
                            }
                        }
                    );


                /* =========================
                   RESPUESTA EXITOSA
                ========================== */

                if (response.ok) {

                    if (formMessage) {

                        formMessage.textContent =
                            `Gracias ${nombre}. Tu mensaje fue enviado correctamente.`;

                        formMessage.className =
                            "form-message success";

                    }


                    console.log(
                        "Mensaje enviado correctamente a Formspree."
                    );


                    /*
                     * Limpiamos el formulario
                     * después del envío.
                     */

                    contactForm.reset();


                } else {

                    /*
                     * Formspree respondió
                     * con un error.
                     */

                    throw new Error(
                        "Formspree no pudo procesar el formulario."
                    );

                }


            } catch (error) {

                console.error(
                    "Error al enviar el formulario:",
                    error
                );


                if (formMessage) {

                    formMessage.textContent =
                        "Hubo un problema al enviar el mensaje. Inténtalo nuevamente.";

                    formMessage.className =
                        "form-message error";

                }

            }


            /* =========================
               RESTAURAR BOTÓN
            ========================== */

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.innerHTML =
                    'Enviar mensaje <span>↗</span>';

            }


            /* =========================
               OCULTAR MENSAJE
               DESPUÉS DE 5 SEGUNDOS
            ========================== */

            setTimeout(() => {

                if (formMessage) {

                    formMessage.textContent = "";

                    formMessage.className =
                        "form-message";

                }

            }, 5000);

        }
    );

}


/* =========================================================
   EFECTO PARALLAX SUTIL DEL HERO
========================================================= */

const hero =
    document.querySelector(".hero");


window.addEventListener(
    "scroll",
    () => {

        if (!hero) {
            return;
        }


        const scrollPosition =
            window.scrollY;


        if (
            scrollPosition <
            window.innerHeight
        ) {

            hero.style.backgroundPosition =
                `center ${scrollPosition * 0.25}px`;

        }

    }
);


/* =========================================================
   PREVENIR ENLACES VACÍOS
========================================================= */

document.querySelectorAll(
    'a[href="#"]'
).forEach(link => {

    link.addEventListener(
        "click",
        event => {

            event.preventDefault();

        }
    );

});