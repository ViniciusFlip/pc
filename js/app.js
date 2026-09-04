import {
    collection,
    getDocs,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



const { db } = await import("../firebase/config.js");
const { auth } = await import("../firebase/config.js");
const { logout } = await import("../services/sessionService.js");
import { initSprintModal, carregarSprints } from "../services/sprint.js";
 
console.log('rheme');
function toggleTheme() {

    document.documentElement.classList.toggle("light");

}
document.addEventListener("click", function (e) {

    const button = e.target.closest(".dropdown-toggle");

    if (!button) return;

    button.parentElement.classList.toggle("open");

});
 
      function toggleSidebar() {
      
      const sidebar = document.getElementById('sidebar');
      const header = document.getElementById('header');
      const icon = document.getElementById('sidebarToggleIcon');
      
      // Mobile
      if (window.innerWidth < 1280) {
      sidebar.classList.toggle('-translate-x-full');
      
      const isOpen = !sidebar.classList.contains('-translate-x-full');
      
      icon.setAttribute(
          "data-lucide",
          isOpen ? "x-square" : "menu"
      );
      
      lucide.createIcons();
      
      return;
      }
      
      // Desktop
 
      sidebar.classList.toggle('collapsed');
    //   header.classList.toggle('minimal');
      
      const collapsed = sidebar.classList.contains('collapsed');
      
      icon.setAttribute(
      "data-lucide",
      collapsed ? "menu" : "x-square"
      );
      
      lucide.createIcons();
      }
       
  
function initUserMenu() {
    const userMenuBtn = document.getElementById("userMenuBtn");
    const userSidebar = document.getElementById("user-sidebar");

    if (!userMenuBtn || !userSidebar) return;

    userMenuBtn.addEventListener("click", () => {
        userSidebar.classList.toggle("hidden");
    });
}
 
function checkHeader() {
    const headerContainer = document.getElementById("header");


    if (window.innerWidth > 1000) {
    

    // headerContainer.style.cssText="position:absolute;z-index:999;width:80%;";

    }
}

checkHeader();
window.addEventListener("resize", checkHeader);

 function initSwiper() {

    // =========================
    // HERO
    // =========================

    const heroElement = document.querySelector(".heroSwiper");

    if (heroElement) {

        const progress = document.querySelector(".timeline-progress");

        function restartProgress() {

            if (!progress) return;

            progress.style.transition = "none";
            progress.style.width = "0%";

            requestAnimationFrame(() => {

                progress.style.transition = "width 5000ms linear";
                progress.style.width = "100%";

            });

        }

        new Swiper(".heroSwiper", {

            loop: true,

            effect: "fade",

            fadeEffect: {
                crossFade: true
            },

            speed: 700,

            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },

            allowTouchMove: false,

            keyboard: {
                enabled: true
            },

            on: {

                init() {
                    restartProgress();
                },

                slideChangeTransitionStart() {
                    restartProgress();
                }

            }

        });

    }


    // =========================
    // LATEST / PROJECTS
    // =========================

    const latestElement = document.querySelector(".latestSwiper");

    if (latestElement) {

        new Swiper(".latestSwiper", {

            loop: true,

            speed: 600,

            slidesPerView: 1.2,

            spaceBetween: 16,

            grabCursor: true,

            autoplay: {

                delay: 4000,

                disableOnInteraction: false,

                pauseOnMouseEnter: true

            },

            navigation: {

                nextEl: ".latest-next",

                prevEl: ".latest-prev"

            },

            breakpoints: {

                640: {

                    slidesPerView: 2.2,

                    spaceBetween: 16

                },

                1024: {

                    slidesPerView: 3,

                    spaceBetween: 16

                }

            }

        });

    }

}

async function carregarUsuarios() {

    const usersList = document.getElementById("usersList");
    if (!usersList) {
        // console.error("Elemento 'usersList' não encontrado.");
        return;
    }else{
        console.log("Elemento 'usersList' encontrado.");
        
    usersList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "users"));

    snapshot.forEach((doc) => {

        const user = doc.data();
 
 const inicial = (user.name || user.email).charAt(0).toUpperCase();

usersList.innerHTML += `
<tr class="hover:bg-white/5 transition">

    <td class="px-6 py-4">

        <div class="flex items-center gap-3">

            <div class="w-10 h-10 rounded-xl bg-[#5864be] text-white flex items-center justify-center font-semibold">
                ${inicial}
            </div>

            <span class="font-medium">
                ${user.name}
            </span>

        </div>

    </td>

    <td class="px-6 py-4 text-zinc-400">
        ${user.email}
    </td>

    <td class="px-6 py-4">
        ${user.role}
    </td>

    <td class="px-6 py-4">
        ${user.downloads ?? 0}
    </td>

    <td class="px-6 py-4">

        <span class="px-3 py-1 rounded-full text-xs
        ${user.status === "active"
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"}">

            ${user.status}

        </span>

    </td>

    <td class="px-6 py-4">

        <div class="flex justify-end gap-2">

            <button class="px-3 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600">
                Editar
            </button>

            <button class="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">
                Banir
            </button>

        </div>

    </td>

</tr>
`;
    });

    }
}

function setActiveMenu(page) {
    document.querySelectorAll("[data-page]").forEach(el => {
        el.classList.remove("bg-[#5864be]", "text-white");
    });

    const active = document.querySelector(`[data-page="${page}"]`);
    if (active) {
        active.classList.add("bg-[#5864be]", "text-white");
    }
}

async function include(id, file) {
    const html = await fetch(file).then(r => r.text());

    const el = document.getElementById(id);

    if(el){
        el.innerHTML = html;
    }
}

function bindNavigation() {
    document.querySelectorAll("[data-page]").forEach(el => {
        el.addEventListener("click", () => {
            loadPage(el.dataset.page);
        });
    });
}

async function loadPage(page) {
    try {
        const response = await fetch(`./pages/${page}.html`);

        if (!response.ok) {
            throw new Error(`Página "${page}" não encontrada.`);
        }

        const html = await response.text();
        var contentElement = document.getElementById("content");

        if(contentElement){
            contentElement.innerHTML = html;
        } 
        if(document.getElementById("sidebar")){
            document.getElementById("sidebar").classList.toggle('collapsed');
        }
        if (page === "usuarios") {
            carregarUsuarios();
        }
        

        if (window.lucide) {
            lucide.createIcons();
            setActiveMenu(page); 
        }

         if(page === "home"){ 
            requestAnimationFrame(() => {
                initSwiper();
            }); 
        }
        if (page === "sprints") {
            initSprintModal();
            carregarSprints();
        }
      

    } catch (error) {
        console.error(error);
        document.getElementById("content").innerHTML = `
            <div class="p-6 text-red-400">
                Erro ao carregar a página <strong>${page}</strong>.
            </div>
        `;
    }
}
 
 

await include("header", "./componentes/header.html");
await include("footer", "./componentes/footer.html");
await include("box-sidebar", "./componentes/sidebar.html");


   const notificationBtn = document.getElementById("notificationBtn");
const notificationDropdown = document.getElementById("notificationDropdown");

 
notificationBtn?.addEventListener("click",()=>{

    notificationDropdown.classList.toggle("hidden");

});
function loadNotifications(){
const notificationCount = document.getElementById("notificationCount");
    const notificationList = document.getElementById("notificationList");


    if(!notificationList){
        console.log("notificationList não encontrado");
        return;
    }
    // const q = query(
    //     collection(db, "notifications")
    // );

    const q = query(
        collection(db, "notifications"),
        orderBy("createdAt", "desc")
    );


    onSnapshot(q, (snapshot)=>{


    

notificationCount.textContent = snapshot.size;
notificationCount.classList.remove("hidden");
        notificationList.innerHTML = "";


        snapshot.forEach((doc)=>{


            const data = doc.data();



        const loginDate = data.createdAt?.toDate 
            ? data.createdAt.toDate() 
            : new Date(data.createdAt);


        const formattedDate = loginDate.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
            // console.log("Dados da notificação:", data);


            notificationList.innerHTML += `

                <div class="
            p-3 
            rounded-xl 
            bg-slate-800 
            border border-slate-700">

            <h4 class="text-white font-semibold text-sm">
                ${data.title}
            </h4>


            <p class="text-slate-400 text-sm">
                ${data.message}
            </p>


            <div class="mt-2 flex items-center gap-2">

                <i data-lucide="clock" 
                   class="w-3 h-3 text-indigo-400">
                </i>


                <span class="text-xs text-slate-500">
                    ${formattedDate}
                </span>

            </div>


        </div>
            `;


        });


    });


}


await loadPage("home");
// await loadPage("build");


function initLogout() {

    document.querySelectorAll("[data-logout]").forEach(button => {

        button.addEventListener("click", async () => {

            const confirmed = confirm("Deseja realmente sair do sistema?");

            if (!confirmed) return;

            await logout();

        });

    });

}
 

const googleProvider = new GoogleAuthProvider();
const continueWithGoogle=document.getElementById("continueWithGoogle")

    if(continueWithGoogle){
      continueWithGoogle.addEventListener("click", async () => {

        const telefone = "5512981053361";

        try {
            // Tenta login com Google
            const result = await signInWithPopup(auth, googleProvider);

            const user = result.user;

            // Tenta salvar o lead no Firestore
            try {
                await addDoc(collection(db, "conversas"), {
                    uid: user.uid,
                    nome: user.displayName || "",
                    email: user.email || "",
                    acao: "Falar sobre meu projeto agora",
                    pagina: window.location.pathname,
                    criadoEm: serverTimestamp()
                });

                console.log("Lead salvo:", user);

            } catch (firestoreError) {
                // Firestore falhou, mas NÃO impede o WhatsApp
                console.error("Erro ao salvar lead:", firestoreError);
            }

            const nome = user.displayName || "Olá";

            const mensagem = `Sou ${nome}. Quero falar sobre meu projeto.`;

            // Google funcionou → WhatsApp com nome
            window.location.href =
                `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

        } catch (googleError) {
            // Google falhou → WhatsApp continua normalmente
            console.error("Erro no login Google:", googleError);

            const mensagem = "Oii, Vinicius!  gostaria de falar sobre meu projeto.";

            window.location.href =
                `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
        }
    });
    }


loadNotifications();
bindNavigation(); 
 initUserMenu();
initLogout();
window.toggleSidebar = toggleSidebar;