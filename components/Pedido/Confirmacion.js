import React, { useEffect, useState } from 'react';
import { Container, Content, Card, CardItem, Input, Label, Item, Tab, Tabs, Left, Thumbnail, Body, Right } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment, { locales } from 'moment';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    TouchableOpacity,
    Dimensions, Button, ToastAndroid,
} from 'react-native';
import '../../utils/Config';
import { CountContext } from '../../utils/Count';
import Header from '../Layout/Header';

const Confirmacion = ({ pedido, openC, navigation }) => {
    const { countItems } = React.useContext(CountContext);
    var deviceWidth = Dimensions.get('window').width;
    var deviceHeight = Dimensions.get('window').height;
    var [activity, setActivity] = useState(false);
    var [clienteId, setClienteId] = useState('');
    var [nroPedido, setNroPedido] = useState('');
    var [fechaEntrega, setFechaEntrega] = useState('');
    var [costoEnvio, setCostoEnvio] = useState();
    var [costoSinIva, setCostoSinIva] = useState();
    var [costoConIva, setCostoConIva] = useState();
    var [iva, setIva] = useState(0);
    var [total, setTotal] = useState();
    var [clienteId, setClienteId] = useState('');
    var [open, setOpen] = useState(false);
    var [data, setData] = useState([]);
    var [datosFacturacion, setDatosFacturacion] = useState([]);
    var [direccionEntrega, setDireccionEntrega] = useState([]);
    var [openMap, setOpenMap] = useState(false);
    var [openInfo, setOpenInfo] = useState(false);
    var [openIngresar, setOpenIngresar] = useState(false);

    const establecer = async () => {
        let clienteId;
        try {
            clienteId = await AsyncStorage.getItem('ClienteId');
            setClienteId(clienteId);
            await getPedido(pedido); await getDatosFacturacion(clienteId, 1);
            await getDireccionEntrega(clienteId, 1);
        } catch (e) {
            console.log(e);
        }
    }
    const toast = (message, duration) => {
        ToastAndroid.show(message, ToastAndroid.BOTTOM)
    }
    const changeConfirmacion = (value) => {
        countItems(0); 
        openC(value); navigation.navigate('Productos');
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
        //Consultamos lista de Productos disponibles desde el api
        const getDireccionEntrega = async (cliente, defecto) => {
            var result = await fetch(`${global.config.appConfig.url.dev}POC_DireccionEntrega?clienteId=${cliente}&defecto=${defecto}`, {
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
    const getDatosFacturacion = async (cliente, defecto) => {
        var result = await fetch(`${global.config.appConfig.url.dev}POC_DatosFacturacion?clienteId=${cliente}&defecto=${defecto}`, {
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
    const getPedido = async (pedido) => {
        var result = await fetch(`${global.config.appConfig.url.dev}POC_Pedido?pedidoId=${pedido}`, {
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
            return promise(result)
        }
    }

    const promise = async (req) => {
        setData(req);
        (await Promise.all([req])).map((items) => {
            if (items.length >= 1) {
                items.forEach((item) => {
                    setNroPedido(item.NroPedido);
                    setFechaEntrega(item.FechaHoraEntrega);
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
    }, [data]);
    return (
        <View style={{ flex: 1, marginTop: deviceHeight * 0.00, backgroundColor: '#fff' }}>
            <Header openInfo={changeOpenInfo} openMap={changeOpenMap} openIngresar={changeOpenIngresar} />
            {(Object.keys(data).length !== 0) ?
            <>
            <Text style={{ fontSize: 20, alignSelf: 'center', fontWeight: 'bold' }}>{`Pedido # ${nroPedido}`}</Text>
            <Text style={{ fontSize: 20, alignSelf: 'center' }}>{`Entrega ${Moment(fechaEntrega).format('DD-MM-YYYY LT')}`}</Text>

            <Container style={styles.container}>
                <Card>
                    <CardItem>
                        <Left>
                            <TouchableOpacity>
                                <Text style={{fontSize:16}}>Resumen del pedido</Text>
                                <Text>{data.length} items</Text>
                                <Text>Valor a pagar: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}</Text>
                            </TouchableOpacity>
                        </Left>
                    </CardItem>
                </Card>
                            <ScrollView>

                                {data.map((key, item) => (
                                    <Card key={item} style={{ flex: 1 }}>
                                        <CardItem>
                                            <Left>
                                                <Thumbnail square large source={{ uri: `data:image/jpeg;base64,${data[item].Image}` }} />
                                            </Left>
                                            
                                                <TouchableOpacity>

                                                        <Text style={styles.titulo}>{data[item].Producto}</Text>
                                                        <Text>Local: {data[item].Nombre}</Text>
                                                        <Text>Fecha Entrega: {Moment(data[item].FechaHoraEntrega).format('DD-MM-YYYY LT')}</Text>
                                                        <Text>Cantidad: {Number.parseFloat(data[item].Cantidad)}</Text>
                                                        <Text style={styles.um}>Valor: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data[item].PrecioUnitario)}</Text>

                                                </TouchableOpacity>

                                        </CardItem>

                                    </Card>

                                ))}
                                <View>
                                    <View style={{padding:14, alignItems:'center'}}>
                                        <Text>IVA 12%: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(iva)}</Text>
                                        <Text style={{fontWeight:'bold'}}>Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}</Text>
                                    </View>
                                    <View>
                                        {Object.keys(datosFacturacion).map((key, item) => (
                                            <Text key={datosFacturacion[item]}>Datos de Facturación: {`${datosFacturacion[item].CedulaRUC} - ${datosFacturacion[item].Nombres}`}</Text>
                                        ))}
                                        {Object.keys(direccionEntrega).map((key, item) => (
                                            <Text key={direccionEntrega[item]}>Datos de Entrega: {`${direccionEntrega[item].Direccion} - ${direccionEntrega[item].Referencia}`}</Text>
                                        ))}
                                        
                                        <Text style={{fontWeight:'bold'}}>Esta información le llegará al correo electrónico, Recuerde que el pago es contra entrega</Text>
                                    </View>
                                    <TouchableOpacity style={{marginTop:10}}>
                                        <Button onPress={() => changeConfirmacion(false)} title={'Iniciar un nuevo pedido'}></Button>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                
            </Container>
            </>
            :
              <></>
            }
        </View>
    );
};

var deviceWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        padding: 14,
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
    }
});

export default Confirmacion;
