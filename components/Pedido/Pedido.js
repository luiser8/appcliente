import React, { useEffect, useState } from 'react';
import { Container, Content, Card, CardItem, Input, Label, Item, Tab, Tabs, Left, Thumbnail, Body, Right } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import {
    SafeAreaView, ActivityIndicator,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Dimensions, Button, ToastAndroid,
} from 'react-native';
import '../../utils/Config';
import Layout from '../Layout/Header';
import Info from '../info/Info';
import Ingresar from '../session/Ingresar';
import Session from '../session/Session';
import NuevaCuenta from '../session/NuevaCuenta';
import DatosFacturacion from './DatosFacturacion';
import Confirmacion from './Confirmacion';

const Pedido = (props) => {
    var deviceWidth = Dimensions.get('window').width;
    var deviceHeight = Dimensions.get('window').height;
    var [activity, setActivity] = useState(false);
    var [costoEnvio, setCostoEnvio] = useState();
    var [costoSinIva, setCostoSinIva] = useState();
    var [costoConIva, setCostoConIva] = useState();
    var [iva, setIva] = useState(0);
    var [total, setTotal] = useState();
    var [clienteId, setClienteId] = useState('');
    var [pedidoId, setPedidoId] = useState('');
    var [usuarioId, setUsuarioId] = useState(null);
    var [correo, setCorreo] = useState('');
    var [usuario, setUsuario] = useState('');
    var [open, setOpen] = useState(false);
    var [confirmado, setConfirmado] = useState(false);
    var [carrito, setCarrito] = useState([]);
    var [datosFacturacion, setDatosFacturacion] = useState([]);
    var [direccionEntrega, setDireccionEntrega] = useState([]);
    var [datosFacturacionId, setDatosFacturacionId] = useState('');
    var [direccionEntregaId, setDireccionEntregaId] = useState('');
    var [editDatosFacturacion, setEditDatosFacturacion] = useState(false);
    var [openMap, setOpenMap] = useState(false);
    var [openInfo, setOpenInfo] = useState(false);
    var [openIngresar, setOpenIngresar] = useState(false);
    var [openNuevaCuenta, setOpenNuevaCuenta] = useState(false);
    var [openDatosFacturacion, setOpenDatosFacturacion] = useState(false);
    const screenHeight = Dimensions.get('window').height;
    const CARD_WIDTH = Dimensions.get('window').width * 1
    const CARD_HEIGHT = Dimensions.get('window').height * 1
    const SPACING_FOR_CARD_INSET = Dimensions.get('window').width * 0.1 - 40

    const getUser = async (items) => {
        let clienteId; let usuarioId; let nombres; let apellidos; let correo;
        try {
            clienteId = await AsyncStorage.getItem('ClienteId');
            usuarioId = await AsyncStorage.getItem('UsuarioId');
            nombres = await AsyncStorage.getItem('Nombres');
            apellidos = await AsyncStorage.getItem('Apellidos');
            correo = await AsyncStorage.getItem('Correo');

            if(usuarioId){
                setUsuarioId(usuarioId);
            }else{
                setUsuarioId(null);
            }

            setClienteId(clienteId);  setUsuario(`${items.Nombres} ${items.Apellidos}`); setCorreo(correo);
        } catch (e) {
            console.log(e); 
        }
    }

    const establecer = async () => {
        let clienteId; let usuarioId; let nombres; let apellidos; let correo;
        try {
            clienteId = await AsyncStorage.getItem('ClienteId');
            usuarioId = await AsyncStorage.getItem('UsuarioId');
            nombres = await AsyncStorage.getItem('Nombres');
            apellidos = await AsyncStorage.getItem('Apellidos');
            correo = await AsyncStorage.getItem('Correo');

            if(usuarioId){
                setUsuarioId(usuarioId);
            }else{
                setUsuarioId(null);
            }

            setClienteId(clienteId);  setUsuario(`${nombres} ${apellidos}`); setCorreo(correo);
            await getCarrito(clienteId); await getDatosFacturacion(clienteId); await getDireccionEntrega(clienteId);
        } catch (e) {
            console.log(e); 
        }
    }
    const toast = (message, duration) => {
        ToastAndroid.show(message, ToastAndroid.BOTTOM)
    }
    const changeConfirmacion = async (open) => {
        if(open){
            if(usuarioId !== null && datosFacturacion !== null && direccionEntrega !== null){
                await confirmacionPedido(pedidoId);
                setConfirmado(open); setOpen(open); 
            }else{
                toast('Debes tener una sesión activa, y ademas datos de facturacion y dirección de entrega', 3000);
            }
        }else{
            setConfirmado(open); setOpen(open);
        }
    }
    const changeOpenMap = (open) => {
        setOpenMap(open); setOpen(open);
    }
    const changeOpenInfo = (open) => {
        setOpenInfo(open); setOpen(open);
    }
    const changeOpenIngresar = (open) => {
        setOpenIngresar(open); setOpen(open);
    }
    const changeClienteId = async (id) => {
        setClienteId(id);
        await getDatosFacturacion(id); await getDireccionEntrega(id);
    }
    const changeOpenNuevaCuenta = (open) => {
        setOpenNuevaCuenta(open); setOpen(open);
    }
    const changeOpenDatosFacturacion = (open, data) => {
        if(data){
            setEditDatosFacturacion(true); setOpenDatosFacturacion(open); setOpen(open);
        }else{
            setEditDatosFacturacion(false); setOpenDatosFacturacion(open); setOpen(open);
        }
    }
    const setDataDatosFacturacion = (data) => {
        setDatosFacturacion([]);
        setDatosFacturacion(df => [...df, data]);
    }
    const confirmacionPedido = async (pedido) => {
        await fetch(`${global.config.appConfig.url.dev}POC_Pedido/${pedido}?Usuario=${usuario}&Email=${correo}`, {
            method: 'PUT',
            headers: global.config.appConfig.headers.dev,
            json: true,
            // body: JSON.stringify(
            //     {
            //         'Usuario': usuario,
            //         'Email': correo
            //     }
            // ),
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}POC_Pedido?clienteId=${clienteId}`)
                .then(response => response.json())
                .then(res => {
                    return setCarrito(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
    }

    const changeDfPorDefecto = async (df) => {
        await fetch(`${global.config.appConfig.url.dev}POC_DatosFacturacion?dfId=${df}`, {
            method: 'PUT',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}POC_DatosFacturacion?clienteId=${clienteId}`)
                .then(response => response.json())
                .then(res => {
                    return setDatosFacturacion(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
    }

    const changeDePorDefecto = async (df) => {
        await fetch(`${global.config.appConfig.url.dev}POC_DireccionEntrega?dfId=${df}`, {
            method: 'PUT',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(() => {
            fetch(`${global.config.appConfig.url.dev}POC_DireccionEntrega?clienteId=${clienteId}`)
                .then(response => response.json())
                .then(res => {
                    return setDireccionEntrega(res)
                })
                .catch(e => console.log(e))
        }).catch(e => console.log(e));
    }
    //Consultamos lista de Productos disponibles desde el api
    const getDatosFacturacion = async (cliente) => {
        var result = await fetch(`${global.config.appConfig.url.dev}POC_DatosFacturacion?clienteId=${cliente}`, {
            method: 'GET',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json()
            } else { // si no se obtiene una respuesta
                response.json().then((json) => {
                    const { Message, StrackTraceString } = json;
                });
                return null
            }
        }).catch(e => console.log(e))
        if (result == null) {
            return "Error get";
        } else {
            return setDatosFacturacion(result)
        }
    }
        //Consultamos lista de Productos disponibles desde el api
        const getDireccionEntrega = async (cliente) => {
            var result = await fetch(`${global.config.appConfig.url.dev}POC_DireccionEntrega?clienteId=${cliente}`, {
                method: 'GET',
                headers: global.config.appConfig.headers.dev,
                json: true
            }).then(response => {
                if (response.status >= 200 && response.status <= 299) {
                    return response.json()
                } else { // si no se obtiene una respuesta
                    response.json().then((json) => {
                        const { Message, StrackTraceString } = json;
                    });
                    return null
                }
            }).catch(e => console.log(e))
            if (result == null) {
                return "Error get";
            } else {
                return setDireccionEntrega(result)
            }
        }
    //Consultamos lista de Productos disponibles desde el api
    const getCarrito = async (cliente) => {
        setActivity(true);
        var result = await fetch(`${global.config.appConfig.url.dev}POC_Pedido?clienteId=${cliente}&confirmacion=${0}`, {
            method: 'GET',
            headers: global.config.appConfig.headers.dev,
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json()
            } else { // si no se obtiene una respuesta
                response.json().then((json) => {
                    const { Message, StrackTraceString } = json;
                });
                return null
            }
        }).catch(e => console.log(e))
        setActivity(false);
        if (result == null) {
            return "Error get";
        } else {
            return promise(result)
        }
    }

    const promise = async (req) => {
        setCarrito(req);
        (await Promise.all([req])).map((items) => {
            if (items.length >= 1) {
                items.forEach((item) => {
                    setPedidoId(item.PedidoId);
                    setCostoEnvio(item.CostoEnvio);
                    setCostoConIva(item.ConIva);
                    setCostoSinIva(item.TotalSinIva);
                    setTotal(item.ValorTotal);
                    setIva(item.Iva);
                })

            } else if (items.length === 0) {
                setActivity(false);
            }
        })
    }
    useEffect(() => {
        establecer();
    }, [datosFacturacion]);
    return (
        <SafeAreaView style={{ flex: 1, }}>
            <View style={{ flex: 1, marginTop: deviceHeight * 0.00, backgroundColor: '#fff' }}>
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
                            <Ingresar openIngresar={changeOpenIngresar} user={getUser} cliente={clienteId} />
                        ) : (
                            <></>
                        )}
                        {openNuevaCuenta ? (
                            <NuevaCuenta open={changeOpenNuevaCuenta} cliente={clienteId} />
                        ) : (
                            <></>
                        )}
                        {openDatosFacturacion ? (
                            <DatosFacturacion open={changeOpenDatosFacturacion} edit={editDatosFacturacion} cliente={clienteId} data={setDataDatosFacturacion} />
                        ) : (
                            <></>
                        )}
                        {confirmado ? (
                           <Confirmacion pedido={pedidoId} openC={changeConfirmacion} navigation={props.navigation} />
                        ) : (
                            <></>
                        )}
                    </>
                ) : (
                        <>
                            <Layout openInfo={changeOpenInfo} openMap={changeOpenMap} openIngresar={changeOpenIngresar} />

                            <Text style={{ fontSize: 20, alignSelf: 'center' }}>Resumen de Pedido</Text>
                            <Container style={styles.container}>

                                <View style={{ Height: "auto", maxHeight: screenHeight }}>
                                    {(Object.keys(carrito).length !== 0) ?

                                        <ScrollView>

                                            <Card>
                                                <CardItem>

                                                    <View>

                                                        <Text style={styles.titulo}>Datos de Pedido</Text>
                                                        <Text>{carrito.length} items</Text>
                                                        <Text>Valor a pagar: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}</Text>

                                                        <View style={{ flex: 1 }}>
                                                            <View style={{ alignItems: 'flex-start' }}>
                                                                <TouchableOpacity style={styles.appButtonContainer} onPress={() => props.navigation.navigate('Carrito')}>
                                                                    <Text style={styles.appButtonText}>{'Ver Carrito'}</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                           
                                                        </View>
                                                    </View>

                                                </CardItem>
                                            </Card>

                                            <Card>
                                                <CardItem>
                                                    <View>
                                                        <Text style={styles.titulo}>Datos de Usuario</Text>
                                                        {usuarioId === null ? (
                                                            <>
                                                            <Text style={{ color: 'red' }}>No se dispone de información de usuario</Text>
                                                            <View style={{ flex: 1 }}>
                                                            <View style={{ alignItems: 'flex-start' }}>
                                                                <TouchableOpacity style={styles.appButtonContainer} onPress={() => changeOpenIngresar(true)}>
                                                                    <Text style={styles.appButtonText}>{'Ingresar'}</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <View style={{ alignItems: 'flex-end', }}>
                                                                <TouchableOpacity style={styles.appButtonContainer2} onPress={() => changeOpenNuevaCuenta(true)}>
                                                                    <Text style={styles.appButtonText}>{'Nueva Cuenta'}</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                            
                                                        </>
                                                        ):(
                                                            <>
                                                           <Text style={{ color: 'green' }}>Usted ha ingresado con la cuenta de {usuario}</Text>
                                                            <View style={{ flex: 1 }}>
                                                            <View style={{ alignItems: 'flex-start' }}>
                                                                <TouchableOpacity style={styles.appButtonContainer} onPress={() => changeOpenIngresar(true)}>
                                                                    <Text style={styles.appButtonText}>{'Cambiar de Cuenta'}</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            
                                                        </View>
                                                        </>
                                                        )}
                                                        
                                                    </View>

                                                </CardItem>

                                            </Card>
                                            <Card>
                                                <CardItem>
                                                    <TouchableOpacity>
                                                        <View>

                                                            <Text style={styles.titulo}>Datos de Facturación</Text>
                                                            {Object.keys(datosFacturacion).length !== 0 ? (
                                                                <>
                                                               <Item>
                                                               <Picker
                                                                   mode="dropdown"
                                                                   selectedValue={datosFacturacionId}
                                                                   style={{ height: 20, width: 199 }}
                                                                   onValueChange={(text) => changeDfPorDefecto(text)}
                                                               >

                                                                       {datosFacturacion.map((key, item) => (

                                                                            <Picker.Item key={datosFacturacion[item]} label={`${datosFacturacion[item].CedulaRUC} - ${datosFacturacion[item].Nombres}`} value={datosFacturacion[item].DatosFacturacionId} />
                                                                               
                                                                       ))}

                                                               </Picker>
                                                                      
                                                           </Item>
                                                           <View style={{ flex: 1 }}>
                                                                    <View style={{ alignItems: 'flex-start' }}>
                                                                        <TouchableOpacity style={styles.appButtonContainer} onPress={() => changeOpenDatosFacturacion(true)}>
                                                                            <Text style={styles.appButtonText}>{'Nuevo'}</Text>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                    <View style={{ alignItems: 'flex-end', }}>
                                                                        <TouchableOpacity style={styles.appButtonContainer2} onPress={() => changeOpenDatosFacturacion(true, datosFacturacionId)}>
                                                                            <Text style={styles.appButtonText}>{'Editar'}</Text>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                           </>
                                                                ):(
                                                                    <View style={{ flex: 1 }}>
                                                                    <View style={{ alignItems: 'flex-start' }}>
                                                                        <TouchableOpacity style={styles.appButtonContainer} onPress={() => changeOpenDatosFacturacion(true)}>
                                                                            <Text style={styles.appButtonText}>{'Nuevo'}</Text>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                    {Object.keys(datosFacturacion).length !== 0 ? (
                                                                        <View style={{ alignItems: 'flex-end', }}>
                                                                            <TouchableOpacity style={styles.appButtonContainer2} onPress={() => changeOpenDatosFacturacion(true, datosFacturacionId)}>
                                                                                <Text style={styles.appButtonText}>{'Editar'}</Text>
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    ):(
                                                                        <></>
                                                                    )}
                                                                    
                                                                </View>
                                                            )}
                                                            
                                                        </View>
                                                    </TouchableOpacity>
                                                </CardItem>

                                            </Card>
                                            <Card>
                                                <CardItem>
                                                    <TouchableOpacity>
                                                        <View>

                                                            <Text style={styles.titulo}>Datos para Entrega</Text>
                                                            {Object.keys(direccionEntrega).length !== 0 ? (
                                                                <>
                                                                  <Item>
                                                                <Picker
                                                                    mode="dropdown"
                                                                    selectedValue={direccionEntregaId}
                                                                    style={{ height: 20, width: 199 }}
                                                                    onValueChange={(text) => changeDePorDefecto(text)}
                                                                >
                                                                    
                                                                    {direccionEntrega.map((key, item) => (
                                                                           <Picker.Item key={direccionEntrega[item]} label={`${direccionEntrega[item].Direccion} - ${direccionEntrega[item].Referencia}`} value={direccionEntrega[item].DireccionEntregaId} />
                                                                    ))}
                                                                </Picker>
                                                            </Item>
                                                                    <View style={{ flex: 1 }}>
                                                                    <View style={{ alignItems: 'flex-start' }}>
                                                                        <TouchableOpacity style={styles.appButtonContainer} onPress={() => changeOpenMap(true)}>
                                                                            <Text style={styles.appButtonText}>{'Nuevo'}</Text>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                    <View style={{ alignItems: 'flex-end', }}>
                                                                        <TouchableOpacity style={styles.appButtonContainer2} onPress={() => props.changeOpenMap(true)}>
                                                                            <Text style={styles.appButtonText}>{'Editar'}</Text>
                                                                        </TouchableOpacity>
                                                                    </View>
                                                                </View>
                                                                </>
                                                                ):(
                                                                <>
                                                                
                                                                </>
                                                            )}
                                                          

                                                        </View>
                                                    </TouchableOpacity>
                                                </CardItem>

                                            </Card>
                                            <Card>
                                                <CardItem>

                                                    <View>

                                                        <Text style={styles.titulo}>Forma de Pago</Text>
                                                        <Text>Por ahora solamente se dispone de pago contra entrega.</Text>
                                                        
                                                    </View>

                                                </CardItem>
                                            </Card>
                                            <TouchableOpacity>
                                                <Button onPress={() => changeConfirmacion(true)} title={'Confirmar Pedido'}></Button>
                                            </TouchableOpacity>
                                        </ScrollView>

                                        :
                                        <>
     
                                            <View style={{ flex: 1, marginTop: 140, alignItems: 'center' }}>
                                                <Text>No hay items aún en tu pedido, busca tus productos y empieza a pedir</Text>
                                            </View>
                                        
                                         {confirmado ? (
                                            <View style={{ flex: 1, marginTop: 190 }}>
                                                <ActivityIndicator animating size={98} color="blue" />
                                            </View>
                                        ) : (
                                            <></>
                                            )}
                                       </>
                                        
                                    }
                                </View>

                            </Container>
                            </>

                    )}
            </View>
        </SafeAreaView>
    );
};

var deviceWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        padding: 14,
        marginTop:-4,
    },
    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    um: {
        fontSize: 14,
        color: '#b71c1c',
    },
    tiempo: {
        fontSize: 14,
        color: '#0d47a1',
    },
    rosa: {
        position: 'relative',
        width: deviceWidth * 0.23, //80
        elevation: 10,
        backgroundColor: "#fff",
        borderRadius: 0,
        paddingVertical: 20,
        paddingHorizontal: 10,
        textAlign: 'center',
        backgroundColor: '#fbe9e7',
    },
    verde: {
        position: 'relative',
        width: deviceWidth * 0.23, //80
        elevation: 10,
        backgroundColor: "#fff",
        borderRadius: 0,
        paddingVertical: 20,
        paddingHorizontal: 10,
        textAlign: 'center',
        backgroundColor: '#e8f5e9',
    },
    azul: {
        position: 'relative',
        width: deviceWidth * 0.23, //80
        elevation: 10,
        backgroundColor: "#fff",
        borderRadius: 0,
        paddingVertical: 20,
        paddingHorizontal: 10,
        textAlign: 'center',
        backgroundColor: '#e3f2fd',
    },
    amarillo: {
        position: 'relative',
        width: deviceWidth * 0.23, //80
        elevation: 10,
        backgroundColor: "#fff",
        borderRadius: 0,
        paddingVertical: 20,
        paddingHorizontal: 10,
        textAlign: 'center',
        backgroundColor: '#fff3e0',
    },
    appButtonText: {
        fontSize: 14,
        color: "#000",
        alignSelf: "center",
        alignItems: 'center',
        margin: -16,
        fontWeight: 'bold'
    },
    appButtonContainer: {
        marginTop: 25,
        paddingTop: 6,
        paddingBottom: 12,
        elevation: 2,
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingVertical: 10,
        paddingHorizontal: 36
    },
    appButtonContainer2: {
        marginTop: -25,
        paddingTop: 12,
        paddingBottom: 12,
        elevation: 2,
        backgroundColor: "#fff",
        borderRadius: 18,
        paddingVertical: 10,
        paddingHorizontal: 36
    },
});

export default Pedido;
