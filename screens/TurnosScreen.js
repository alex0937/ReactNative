import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const horasDisponibles = [
  '08:00','09:00','10:00','11:00','12:00',
  '15:00','16:00','17:00','18:00','19:00','20:00'
];

export default function TurnosScreen() {
  /* ---------- ESTADO LOCAL (mock) ---------- */
  const [turnos, setTurnos]           = useState([]);
  const [modo, setModo]               = useState('lista');   // lista | nuevo | edicion
  const [idEditando, setIdEditando]   = useState(null);
  const [socio, setSocio]             = useState('');
  const [fecha, setFecha]             = useState('');
  const [hora, setHora]               = useState('');

  /* ---------- CRUD ---------- */
  const resetForm = () => {
    setSocio(''); setFecha(''); setHora(''); setIdEditando(null); setModo('lista');
  };

  const validar = () => {
    if(!socio.trim() || !fecha.trim() || !hora.trim()){
      Alert.alert('Faltan datos','Completa todos los campos');
      return false;
    }
    return true;
  };

  const crearTurno = () => {
    if(!validar()) return;
    const nuevo = { id: Date.now().toString(), socio: socio.trim(), fecha, hora };
    setTurnos([...turnos, nuevo]);
    resetForm();
  };

  const actualizarTurno = () => {
    if(!validar()) return;
    setTurnos(turnos.map(t => t.id === idEditando ? { ...t, socio: socio.trim(), fecha, hora } : t));
    resetForm();
  };

  const eliminarTurno = id => {
    Alert.alert('¿Borrar?','Esta acción no se puede deshacer.',[
      {text:'Cancelar'}, {text:'Borrar', onPress:() => setTurnos(turnos.filter(t => t.id !== id))}
    ]);
  };

  const seleccionarTurno = item => {
    setSocio(item.socio); setFecha(item.fecha); setHora(item.hora);
    setIdEditando(item.id); setModo('edicion');
  };

  /* ---------- RENDER ---------- */
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => seleccionarTurno(item)}>
      <View style={{ flex:1 }}>
        <Text style={styles.cardTitle}>{item.socio}</Text>
        <Text style={styles.cardSub}>{item.fecha}  •  {item.hora}</Text>
      </View>
      <TouchableOpacity onPress={() => eliminarTurno(item.id)}>
        <Text style={styles.borrar}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if(modo !== 'lista') return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>
        {modo === 'nuevo' ? 'Nuevo Turno' : 'Editar Turno'}
      </Text>

      <Text style={styles.label}>Socio</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del socio"
        value={socio}
        onChangeText={setSocio}
      />

      <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="2025-10-16"
        value={fecha}
        onChangeText={setFecha}
      />

      <Text style={styles.label}>Hora</Text>
      <View style={styles.horaWrap}>
        {horasDisponibles.map(h => (
          <TouchableOpacity
            key={h}
            onPress={() => setHora(h)}
            style={[styles.horaBtn, h === hora && styles.horaBtnActivo]}
          >
            <Text style={[styles.horaTxt, h === hora && styles.horaTxtActivo]}>{h}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.botones}>
        <TouchableOpacity style={styles.btnSec} onPress={resetForm}>
          <Text>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnPri} onPress={modo==='nuevo'? crearTurno : actualizarTurno}>
          <Text style={styles.btnPriTxt}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Turnos del Gimnasio</Text>

      <FlatList
        data={turnos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.vacio}>No hay turnos asignados</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModo('nuevo')}>
        <Text style={styles.fabTxt}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ---------- ESTILOS ---------- */
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#f2f2f2', padding:16 },
  header:{ fontSize:24, fontWeight:'bold', color:'#1cc741', marginBottom:16 },
  card:{ backgroundColor:'#fff', borderRadius:10, padding:14, marginBottom:10, flexDirection:'row', alignItems:'center', elevation:2 },
  cardTitle:{ fontSize:16, fontWeight:'600' },
  cardSub:{ fontSize:13, color:'#555', marginTop:2 },
  borrar:{ fontSize:20, paddingLeft:10 },
  vacio:{ textAlign:'center', marginTop:40, color:'#888' },
  label:{ marginTop:12, marginBottom:4, fontWeight:'600', color:'#333' },
  input:{ backgroundColor:'#fff', borderRadius:8, paddingHorizontal:12, height:44, borderWidth:1, borderColor:'#ddd' },
  horaWrap:{ flexDirection:'row', flexWrap:'wrap', marginTop:6 },
  horaBtn:{ backgroundColor:'#fff', borderRadius:6, paddingVertical:8, paddingHorizontal:12, margin:4, borderWidth:1, borderColor:'#ddd' },
  horaBtnActivo:{ backgroundColor:'#1cc741', borderColor:'#1cc741' },
  horaTxt:{ color:'#333' },
  horaTxtActivo:{ color:'#fff', fontWeight:'bold' },
  botones:{ flexDirection:'row', marginTop:24, justifyContent:'flex-end' },
  btnSec:{ paddingHorizontal:16, paddingVertical:10, marginRight:8 },
  btnPri:{ backgroundColor:'#1cc741', paddingHorizontal:20, paddingVertical:10, borderRadius:8 },
  btnPriTxt:{ color:'#fff', fontWeight:'bold' },
  fab:{ position:'absolute', bottom:24, right:24, width:56, height:56, borderRadius:28, backgroundColor:'#1cc741', justifyContent:'center', alignItems:'center', elevation:6 },
  fabTxt:{ fontSize:24, color:'#fff', lineHeight:24 }
});