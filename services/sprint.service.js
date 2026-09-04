import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "../firebase/config.js";


// ==========================================
// LISTAR SPRINTS
// ==========================================

export async function listarSprints() {

  const sprintCollection = collection(db, "sprints");

  const snapshot = await getDocs(sprintCollection);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

}


// ==========================================
// CRIAR SPRINT
// ==========================================

export async function criarSprint(nome) {

  const sprintCollection = collection(db, "sprints");

  const docRef = await addDoc(sprintCollection, {

    nome: nome,

    createdAt: serverTimestamp()

  });

  return docRef.id;

}


// ==========================================
// EXCLUIR SPRINT
// ==========================================

export async function excluirSprint(id) {

  const sprintCollection = collection(db, "sprints");

  await deleteDoc(
    doc(sprintCollection, id)
  );

}