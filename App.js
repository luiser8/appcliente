import React, { useEffect, useState, useMemo } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import localization from 'moment/locale/es';
import RNBootSplash from "react-native-bootsplash";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { AuthContext } from './utils/Context';
import Session from './components/session/Session';
import Tabs from './tabs/Tabs';

const App = () => {
  var [activity, setActivity] = useState(true);
  var [session, setSession] = useState(true);
  var [user, setUser] = useState(null);
  var [usuario, setUsuario] = useState(null);
  var [cedula, setCedula] = useState(null);
  var [nombres, setNombres] = useState(null);
  var [apellidos, setApellidos] = useState(null);
  var [correo, setCorreo] = useState(null);
  var [telefono, setTelefono] = useState(null);
  var [direccion, setDireccion] = useState(null);
  var [items, setItems] = useState('0');
  var [error, setError] = useState();
  var [open, setOpen] = useState(false);

  const changeSession = (open) => {
    setOpen(open);
  }

  const authContext = useMemo(() => ({
    signIn: async (foundUser) => {
      const mapa = Boolean(foundUser.Mapa);
      const userId = String(foundUser.ClienteId);
      const usuario = String(foundUser.UsuarioId);
      const cedula = String(foundUser.Cedula);
      const nombres = String(foundUser.Nombres);
      const apellidos = String(foundUser.Apellidos);
      const correo = String(foundUser.Correo);
      const telefono = String(foundUser.Telefono);
      const direccion = String(foundUser.Direccion);

      //const userNombres = String(foundUser.Temporal);
      try {
        if (userId !== null) {
          await AsyncStorage.setItem('ClienteId', userId);
          if(!mapa){
            await AsyncStorage.setItem('UsuarioId', usuario);
            await AsyncStorage.setItem('Cedula', cedula);
            await AsyncStorage.setItem('Nombres', nombres);
            await AsyncStorage.setItem('Apellidos', apellidos);
            await AsyncStorage.setItem('Correo', correo);
            await AsyncStorage.setItem('Telefono', telefono);
            await AsyncStorage.setItem('Direccion', direccion);
          }
          setUser(userId); setUsuario(usuario); setCedula(cedula); setNombres(nombres); setApellidos(apellidos); 
          setCorreo(correo); setTelefono(telefono); setDireccion(direccion);
        } else {
          setUser(null); setUsuario(null); setCedula(null); setNombres(null); setApellidos(null); 
          setCorreo(null); setTelefono(null); setDireccion(null);
          setError(userId)
        }

      } catch (e) {
        console.log(e);
        setUser(null); setError(null);
      }
      setUser(userId); setUsuario(usuario); setCedula(cedula); setNombres(nombres); setApellidos(apellidos); 
      setCorreo(correo); setTelefono(telefono); setDireccion(direccion);setError(userId);//setUserName(`${userNombres}`);
    },
    signOut: async () => {
      try {
        //await AsyncStorage.removeItem('ClienteId');
        await AsyncStorage.removeItem('UsuarioId');
        await AsyncStorage.removeItem('Cedula');
        await AsyncStorage.removeItem('Nombres');
        await AsyncStorage.removeItem('Apellidos');
        await AsyncStorage.removeItem('Correo');
        await AsyncStorage.removeItem('Telefono');
        await AsyncStorage.removeItem('Direccion');
      } catch (e) {
        console.log(e);
        //setUser(null); 
        setUsuario(null); setCedula(null); setNombres(null); setApellidos(null); 
        setCorreo(null); setTelefono(null); setDireccion(null);
      }
      //setUser(null); 
      setUsuario(null); setCedula(null); setNombres(null); setApellidos(null); 
      setCorreo(null); setTelefono(null); setDireccion(null);
    }
  }), []);

  useEffect(() => {
    RNBootSplash.hide({ duration: 150 });
    moment.updateLocale('es', localization);

    setTimeout(async () => {
      let userId; let usuario; let cedula; let nombres; let apellidos; let correo; let telefono; let direccion;
      try {
        userId = await AsyncStorage.getItem('ClienteId');
        usuario = await AsyncStorage.getItem('UsuarioId');
        cedula = await AsyncStorage.getItem('Cedula');
        nombres = await AsyncStorage.getItem('Nombres');
        apellidos = await AsyncStorage.getItem('Apellidos');
        correo = await AsyncStorage.getItem('Correo');
        telefono = await AsyncStorage.getItem('Telefono');
        direccion = await AsyncStorage.getItem('Direccion');
      } catch (e) {
        console.log(e);
        setUser(null); setUsuario(null); setCedula(null); setNombres(null); setApellidos(null); 
      setCorreo(null); setTelefono(null); setDireccion(null);
      }
      setUser(userId); setUsuario(usuario); setCedula(cedula); setNombres(nombres); setApellidos(apellidos); 
      setCorreo(correo); setTelefono(telefono); setDireccion(direccion);setError(userId);
      setActivity(false);
    }, 100);
  }, []);
  return (
    <>
      {Platform.OS === 'android' && <StatusBar barStyle="default" />}
      <AuthContext.Provider value={authContext} key={user}>
        {activity ? (
          <View style={{ flex: 1, marginTop: 300 }}>
            <ActivityIndicator size={88} color="blue" />
          </View>
        ) : (
            <>
              {user !== null ? (
                <NavigationContainer>
                    <Tabs />
                </NavigationContainer>
              ) : (
                  <Session open={changeSession} />
                )}
            </>
          )}

      </AuthContext.Provider>
    </>
  );
};

export default App;
