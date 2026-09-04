import {
    collection,
    getDocs,
    query,
    orderBy,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const { db } = await import("../firebase/config.js");


// ==========================================
// MODAL — NOVA SPRINT
// ==========================================

export function initSprintModal() {

    const btnNovaSprint = document.getElementById("btnNovaSprint");
    const btnCancelarSprint = document.getElementById("btnCancelarSprint");
    const modalSprint = document.getElementById("modalSprint");
    const inputNomeSprint = document.getElementById("inputNomeSprint");
    const formSprint = document.getElementById("formSprint");

    if (
        !btnNovaSprint ||
        !btnCancelarSprint ||
        !modalSprint ||
        !formSprint
    ) {
        return;
    }

    function abrirModal() {
        modalSprint.classList.remove("hidden");
        modalSprint.classList.add("flex");

        inputNomeSprint?.focus();
    }

    function fecharModal() {
        modalSprint.classList.add("hidden");
        modalSprint.classList.remove("flex");

        if (inputNomeSprint) {
            inputNomeSprint.value = "";
        }
    }

    btnNovaSprint.addEventListener("click", abrirModal);

    btnCancelarSprint.addEventListener("click", fecharModal);


    // ==========================================
    // CRIAR SPRINT
    // ==========================================

    formSprint.addEventListener("submit", async (event) => {

        event.preventDefault();

        const nome = inputNomeSprint?.value.trim();

        if (!nome) return;

        try {

            const id = await criarSprint(nome);

            console.log("Sprint criada:", id);

            fecharModal();

            // Atualiza a lista sem recarregar a página
            await carregarSprints();

        } catch (error) {

            console.error("Erro ao criar sprint:", error);

        }

    });


    // ==========================================
    // FECHAR CLICANDO FORA
    // ==========================================

    modalSprint.addEventListener("click", (event) => {

        if (event.target === modalSprint) {
            fecharModal();
        }

    });


    // ==========================================
    // FECHAR COM ESC
    // ==========================================

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            !modalSprint.classList.contains("hidden")
        ) {
            fecharModal();
        }

    });

}


// ==========================================
// LISTAR SPRINTS — FIRESTORE
// ==========================================

export async function listarSprints() {

    const sprintsRef = collection(db, "sprints");

    const q = query(
        sprintsRef,
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(item => ({
        id: item.id,
        ...item.data()
    }));

}


// ==========================================
// CARREGAR SPRINTS — INTERFACE
// ==========================================

export async function carregarSprints() {

    const lista = document.getElementById("listaSprints");
    const estadoVazio = document.getElementById("estadoVazio");

    if (!lista || !estadoVazio) {
        return;
    }

    try {

        const sprints = await listarSprints();

        lista.innerHTML = "";

        // Nenhuma sprint
        if (sprints.length === 0) {

            estadoVazio.classList.remove("hidden");

            return;
        }

        // Existem sprints
        estadoVazio.classList.add("hidden");


        sprints.forEach(sprint => {

            const elemento = document.createElement("div");

            elemento.className =
                "rounded-2xl border border-zinc-800 bg-zinc-950 p-5";

            elemento.innerHTML = `
                <div class="flex items-center justify-between gap-4">

                    <div>
                        <h3 class="font-medium text-white">
                            ${escaparHTML(sprint.nome)}
                        </h3>
                    </div>

                </div>
            `;

            lista.appendChild(elemento);

        });

    } catch (error) {

        console.error("Erro ao carregar sprints:", error);

    }

}


// ==========================================
// CRIAR
// ==========================================

export async function criarSprint(nome) {

    const sprintsRef = collection(db, "sprints");

    const docRef = await addDoc(
        sprintsRef,
        {
            nome: nome,
            createdAt: serverTimestamp()
        }
    );

    return docRef.id;

}


// ==========================================
// ATUALIZAR
// ==========================================

export async function atualizarSprint(id, nome) {

    await updateDoc(
        doc(db, "sprints", id),
        {
            nome: nome
        }
    );

}


// ==========================================
// EXCLUIR
// ==========================================

export async function excluirSprint(id) {

    await deleteDoc(
        doc(db, "sprints", id)
    );

}


// ==========================================
// SEGURANÇA — ESCAPAR HTML
// ==========================================

function escaparHTML(valor) {

    const div = document.createElement("div");

    div.textContent = valor ?? "";

    return div.innerHTML;

}