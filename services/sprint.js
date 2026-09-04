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
// LISTAR
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