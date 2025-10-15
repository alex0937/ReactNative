import { useState, useEffect, useCallback } from 'react';
import { 
  createSocio, 
  getAllSocios, 
  updateSocio, 
  deleteSocio 
} from '../config/sociosService';

export const useSocios = () => {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todos los socios
  const loadSocios = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllSocios();
      if (result.success) {
        setSocios(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al cargar los socios');
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo socio
  const addSocio = async (socioData) => {
    setError(null);
    try {
      const result = await createSocio(socioData);
      if (result.success) {
        await loadSocios(); // Recargar la lista
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = 'Error al crear el socio';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Actualizar socio
  const editSocio = async (socioId, updateData) => {
    setError(null);
    try {
      const result = await updateSocio(socioId, updateData);
      if (result.success) {
        await loadSocios(); // Recargar la lista
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = 'Error al actualizar el socio';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Eliminar socio
  const removeSocio = async (socioId) => {
    setError(null);
    try {
      const result = await deleteSocio(socioId);
      if (result.success) {
        await loadSocios(); // Recargar la lista
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = 'Error al eliminar el socio';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Filtrar socios por texto de búsqueda
  const searchSocios = useCallback((searchText = '', filterStatus = 'Todos') => {
    if (!Array.isArray(socios)) {
      return [];
    }

    let filtered = [...socios];

    // Filtrar por texto de búsqueda
    if (searchText && searchText.trim()) {
      filtered = filtered.filter(socio =>
        socio?.nombre?.toLowerCase().includes(searchText.toLowerCase()) ||
        socio?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        (socio?.telefono && socio.telefono.includes(searchText))
      );
    }

    // Filtrar por estado
    if (filterStatus !== 'Todos') {
      filtered = filtered.filter(socio => socio?.estado === filterStatus);
    }

    return filtered;
  }, [socios]);

  // Estadísticas de socios
  const getSociosStats = useCallback(() => {
    if (!Array.isArray(socios)) {
      return { total: 0, activos: 0, inactivos: 0, porcentajeActivos: 0 };
    }

    const total = socios.length;
    const activos = socios.filter(socio => socio?.estado === 'Activo').length;
    const inactivos = socios.filter(socio => socio?.estado === 'Inactivo').length;

    return {
      total,
      activos,
      inactivos,
      porcentajeActivos: total > 0 ? Math.round((activos / total) * 100) : 0
    };
  }, [socios]);

  // Cargar socios al inicializar el hook
  useEffect(() => {
    loadSocios();
  }, []);

  return {
    socios,
    loading,
    error,
    loadSocios,
    addSocio,
    editSocio,
    removeSocio,
    searchSocios,
    getSociosStats,
    clearError: () => setError(null)
  };
};