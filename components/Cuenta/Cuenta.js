import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../Layout/Header';
import Info from '../info/Info';
import Ingresar from '../session/Ingresar';
import Session from '../session/Session';
import { AuthContext } from '../../utils/Context';
import HistorialPedidos from './HistorialPedidos';
import Facturacion from './Facturacion';
import Entrega from './Entrega';
import Usuario from './Usuario';
import FormaDePago from './FormaDePago';
import Terminos from './Terminos';
import Tickets from './Tickets';
import Contactenos from './Contactenos';

const Cuenta = (props) => {
    const { signOut } = React.useContext(AuthContext);
    var deviceWidth = Dimensions.get('window').width;
    var deviceHeight = Dimensions.get('window').height;
    var [clienteId, setClienteId] = useState('');
    var [open, setOpen] = useState(false);
    var [historialPedidos, setHistorialPedidos] = useState(false);
    var [facturacion, setFacturacion] = useState(false);
    var [entrega, setEntrega] = useState(false);
    var [usuario, setUsuario] = useState(false);
    var [formaDepago, setFormaDepago] = useState(false);
    var [terminos, setTerminos] = useState(false);
    var [tickets, setTickets] = useState(false);
    var [contactenos, setContactenos] = useState(false);
    var [isOpen, setIsOpen] = useState('');
    var [openMap, setOpenMap] = useState(false);
    var [openInfo, setOpenInfo] = useState(false);
    var [openIngresar, setOpenIngresar] = useState(false);

    const establecer = async () => {
        let clienteId;
        try {
            clienteId = await AsyncStorage.getItem('ClienteId');
            setClienteId(clienteId); 
        } catch (e) {
            console.log(e); 
        }
    }

    const changeOpenMap = (open) => {
        setOpenMap(open); setOpen(open); setIsOpen('map');
    }
    const changeOpenInfo = (open) => {
        setOpenInfo(open); setOpen(open); setIsOpen('info');

    }
    const changeOpenIngresar = (open) => {
        setOpenIngresar(open); setOpen(open); setIsOpen('ingresar');
    }
    const changeHistorialPedidos = (open) => {
        setHistorialPedidos(open); setOpen(open);
    }
    const changeFacturacion = (open) => {
        setFacturacion(open); setOpen(open);
    }
    const changeEntrega = (open) => {
        setEntrega(open); setOpen(open);
    }
    const changeUsuario = (open) => {
        setUsuario(open); setOpen(open);
    }
    const changeFormaPago = (open) => {
        setFormaDepago(open); setOpen(open);
    }
    const changeTerminos = (open) => {
        setTerminos(open); setOpen(open);
    }
    const changeTickets = (open) => {
        setTickets(open); setOpen(open);
    }
    const changeContactenos = (open) => {
        setContactenos(open); setOpen(open);
    }
    useEffect(() => {
        establecer();
    }, []);
    return (
        <SafeAreaView style={{ flex: 1, marginTop: deviceHeight * 0.00, backgroundColor: '#fff' }}>
            {open ? (
                <>
                    {openInfo ? (
                        <Info openInfo={changeOpenInfo} />
                    ) : (
                            <></>
                        )}
                    {openMap ? (
                        <Session open={changeOpenMap} />
                    ) : (
                            <></>
                        )}
                    {openIngresar ? (
                        <Ingresar openIngresar={changeOpenIngresar} cliente={clienteId} />
                    ) : (
                            <></>
                        )}
                    {historialPedidos ? (
                        <HistorialPedidos open={changeHistorialPedidos} cliente={clienteId} />
                    ) : (
                            <></>
                        )}
                    {facturacion ? (
                        <Facturacion open={changeFacturacion} cliente={clienteId} />
                    ) : (
                            <></>
                        )}
                    {entrega ? (
                        <Entrega open={changeEntrega} cliente={clienteId} />
                    ) : (
                            <></>
                        )}
                    {usuario ? (
                        <Usuario open={changeUsuario} cliente={clienteId} />
                    ) : (
                            <></>
                        )}
                    {formaDepago ? (
                        <FormaDePago open={changeFormaPago} cliente={clienteId} />
                    ) : (
                            <></>
                        )}
                    {terminos ? (
                        <Terminos open={changeTerminos} cliente={clienteId} />
                    ) : (
                            <></>
                        )}
                    {tickets ? (
                        <Tickets open={changeTickets} cliente={clienteId} />
                    ) : (
                            <></>
                        )}
                    {contactenos ? (
                        <Contactenos open={changeContactenos} cliente={clienteId} />
                    ) : (
                            <></>
                        )}
                </>
            ) : (
                    <>
                        <Header openInfo={changeOpenInfo} openMap={changeOpenMap} openIngresar={changeOpenIngresar} />
                        <View style={styles.container}>
                            <View style={{ marginTop: -12, marginBottom: 15 }}>
                                <Text style={styles.title}>Cuenta</Text>
                            </View>
                            <TouchableOpacity style={styles.buttons} onPress={() => changeHistorialPedidos(true)}>
                                <Text style={styles.textWrapper}>Historial de Pedidos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttons} onPress={() => changeUsuario(true)}>
                                <Text style={styles.textWrapper}>Información de Usuario</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttons} onPress={() => changeFacturacion(true)}>
                                <Text style={styles.textWrapper}>Datos de Facturación</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttons}  onPress={() => changeEntrega(true)}>
                                <Text style={styles.textWrapper}>Datos de Entrega</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttons} onPress={() => changeFormaPago(true)}>
                                <Text style={styles.textWrapper}>Datos de Forma de Pago</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttons}>
                                <Text style={styles.textWrapper}>Usuario para la Familia</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttons} onPress={() => changeTerminos(true)}>
                                <Text style={styles.textWrapper}>Términos y Condiciones</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttons} onPress={() => changeTickets(true)}>
                                <Text style={styles.textWrapper}>Tickets de Servicio</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttons} onPress={() => changeContactenos(true)}>
                                <Text style={styles.textWrapper}>Contáctenos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttons} onPress={() => signOut()}>
                                <Text style={styles.textWrapper}>Cerrar Sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}


        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    appButtonContainer: {
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 32,
        elevation: 8,
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingVertical: 20,
        paddingHorizontal: 26
    },
    title: {
        fontSize: 20,
        fontWeight: 'normal',
        alignItems: 'center',
        textAlign: 'center',
    },
    appButtonText: {
        fontSize: 16,
        color: "#000",
        alignSelf: "center",
    },
    container: {
        padding: 10,
    },
    buttons: {
        padding: 10,
        fontSize: 18,
    },
    textWrapper: {
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
export default Cuenta;
