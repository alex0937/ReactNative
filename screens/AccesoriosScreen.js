// src/screens/AccesoriosScreen.js
import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ESTADOS = {
  OK:      { label: 'Todo en orden',   color: '#34C759' },
  PERDIDO: { label: 'Perdido',         color: '#FF9500' },
  FUERA:   { label: 'Fuera de servicio', color: '#FF3B30' },
};

export default function AccesoriosScreen() {
  const [lista, setLista] = useState([
    { id: '1', nombre: 'Mancuernas',  esperados: 15, contados: 15, estado: 'OK',      obs: '' },
    { id: '2', nombre: 'Bandas',      esperados: 5,  contados: 5,  estado: 'OK',      obs: '' },
    { id: '3', nombre: 'Colchonetas', esperados: 20, contados: 18, estado: 'PERDIDO', obs: 'Faltan 2' },
    { id: '4', nombre: 'Pesas',       esperados: 12, contados: 12, estado: 'FUERA',   obs: 'Rotas 2' },
  ]);

  const [obsGeneral, setObsGeneral] = useState('');

  const cambiarEstado = (id, nuevoEstado) =>
    setLista(lista.map(x => (x.id === id ? { ...x, estado: nuevoEstado } : x)));

  const cambiarContados = (id, cantidad) =>
    setLista(lista.map(x => (x.id === id ? { ...x, contados: cantidad } : x)));

  const cambiarObs = (id, texto) =>
    setLista(lista.map(x => (x.id === id ? { ...x, obs: texto } : x)));

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>{item.nombre}</Text>
      <View style={styles.row}>
        <Text>Esperados: <Text style={styles.bold}>{item.esperados}</Text></Text>
        <Text>Contados: <Text style={styles.bold}>{item.contados}</Text></Text>
      </View>

      <View style={styles.counterRow}>
        <TouchableOpacity onPress={() => cambiarContados(item.id, Math.max(0, item.contados - 1))}>
          <Text style={styles.btnCounter}>-</Text>
        </TouchableOpacity>
        <Text style={styles.counter}>{item.contados}</Text>
        <TouchableOpacity onPress={() => cambiarContados(item.id, item.contados + 1)}>
          <Text style={styles.btnCounter}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.estadoWrap}>
        {Object.keys(ESTADOS).map(key => (
          <TouchableOpacity
            key={key}
            onPress={() => cambiarEstado(item.id, key)}
            style={[styles.estadoBtn, item.estado === key && { backgroundColor: ESTADOS[key].color }]}>
            <Text style={[styles.estadoTxt, item.estado === key && { color: '#fff' }]}>
              {ESTADOS[key].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Observación"
        value={item.obs}
        onChangeText={txt => cambiarObs(item.id, txt)}
      />
    </View>
  );

  const total = lista.length;
  const contados = lista.filter(x => x.contados === x.esperados).length;
  const faltantes = lista.filter(x => x.contados < x.esperados).length;
  const fueraServ = lista.filter(x => x.estado === 'FUERA').length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.resumen}>
        <Text style={styles.resumenTitle}>Resumen del conteo</Text>
        <View style={styles.resumenRow}>
          <Text>Total: <Text style={styles.bold}>{total}</Text></Text>
          <Text>Contados: <Text style={styles.bold}>{contados}</Text></Text>
        </View>
        <View style={styles.resumenRow}>
          <Text>Faltantes: <Text style={styles.bold}>{faltantes}</Text></Text>
          <Text>Fuera serv.: <Text style={styles.bold}>{fueraServ}</Text></Text>
        </View>
      </View>

      <FlatList
        data={lista}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TextInput
        style={styles.textArea}
        placeholder="Observaciones generales del día..."
        value={obsGeneral}
        onChangeText={setObsGeneral}
        multiline
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#f2f2f2', padding: 16 },
  resumen:     { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 12 },
  resumenTitle:{ fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  resumenRow:  { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  card:        { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10 },
  nombre:      { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  row:         { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  bold:        { fontWeight: 'bold' },
  counterRow:  { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginVertical: 6 },
  btnCounter:  { fontSize: 22, paddingHorizontal: 12, color: '#1cc741' },
  counter:     { fontSize: 18, marginHorizontal: 12, minWidth: 30, textAlign: 'center' },
  estadoWrap:  { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8 },
  estadoBtn:   {
    flex: 1,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  estadoTxt:   { fontSize: 12, color: '#333' },
  input:       {
    backgroundColor: '#f7f7f7',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 6,
    fontSize: 13,
  },
  textArea:    {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    maxHeight: 80,
    fontSize: 14,
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
});