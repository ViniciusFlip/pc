import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "../firebase/config.js";


const sprintCollection = collection(db, "sprints");


// LISTAR SPRINTS
export async function listarSprints() {

  const snapshot = await getDocs(sprintCollection);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

}


// CRIAR SPRINT
export async function criarSprint(nome) {

  const docRef = await addDoc(sprintCollection, {

    nome: nome,

    createdAt: serverTimestamp()

  });

  return docRef.id;

}


// EXCLUIR SPRINT
export async function excluirSprint(id) {

  await deleteDoc(
    doc(sprintCollection, id)
  );

}