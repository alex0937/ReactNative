import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

const db = getFirestore();
const SOCIOS_COLLECTION = 'socios';

// Crear nuevo socio
export const createSocio = async (socioData) => {
  try {
    const docRef = doc(collection(db, SOCIOS_COLLECTION));
    const newSocio = {
      ...socioData,
      id: docRef.id,
      fechaRegistro: serverTimestamp(),
      estado: 'Activo'
    };
    
    await setDoc(docRef, newSocio);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error al crear socio:', error);
    return { success: false, error: error.message };
  }
};

// Obtener todos los socios
export const getAllSocios = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, SOCIOS_COLLECTION), orderBy('fechaRegistro', 'desc'))
    );
    
    const socios = [];
    querySnapshot.forEach((doc) => {
      socios.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: socios };
  } catch (error) {
    console.error('Error al obtener socios:', error);
    return { success: false, error: error.message };
  }
};

// Buscar socios por nombre o email
export const searchSocios = async (searchTerm) => {
  try {
    const querySnapshot = await getDocs(collection(db, SOCIOS_COLLECTION));
    
    const socios = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.email.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        socios.push({ id: doc.id, ...data });
      }
    });
    
    return { success: true, data: socios };
  } catch (error) {
    console.error('Error al buscar socios:', error);
    return { success: false, error: error.message };
  }
};

// Filtrar socios por estado
export const filterSociosByStatus = async (estado) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, SOCIOS_COLLECTION), where('estado', '==', estado))
    );
    
    const socios = [];
    querySnapshot.forEach((doc) => {
      socios.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: socios };
  } catch (error) {
    console.error('Error al filtrar socios:', error);
    return { success: false, error: error.message };
  }
};

// Actualizar socio
export const updateSocio = async (socioId, updateData) => {
  try {
    const docRef = doc(db, SOCIOS_COLLECTION, socioId);
    await updateDoc(docRef, {
      ...updateData,
      fechaModificacion: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar socio:', error);
    return { success: false, error: error.message };
  }
};

// Eliminar socio
export const deleteSocio = async (socioId) => {
  try {
    const docRef = doc(db, SOCIOS_COLLECTION, socioId);
    await deleteDoc(docRef);
    
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar socio:', error);
    return { success: false, error: error.message };
  }
};