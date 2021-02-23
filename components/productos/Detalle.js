import React, { useEffect, useState } from 'react';
import { Container, Content, Badge, Card, CardItem, Input, Label, Item, Tab, Tabs, Left, Thumbnail, Image, Body, Right } from 'native-base';
import {
    SafeAreaView, ActivityIndicator,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Dimensions, Button, ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { CountContext } from '../../utils/Count';
import '../../utils/Config';
import Moment from 'moment';

import Recordatorio from '../Carrito/Recordatorio';

const Detalle = (props) => {
    const { countItems } = React.useContext(CountContext);
    var [producto, setProducto] = useState(props.item);
    var [fechaInicio, setFechaInicio] = useState(Moment(new Date()).format('YYYY-MM-DD hh:mm:ss'));
    var [activity, setActivity] = useState(false);
    var [recodar, setRecordar] = useState(false);
    var [productos, setProductos] = useState([]);
    var [cantidad, setCantidad] = useState(0);
    var [suma, setSuma] = useState(0);
    var [carrito, setCarrito] = useState([]);
    var [prod, setProd] = useState([]);

    const toast = (message, duration) => {
        ToastAndroid.show(message, ToastAndroid.BOTTOM)
    }
    const openRecordatorio = (info) => {
        setRecordar(info);
    }
    const sumatoria = () => {
        var total = 0; var cantidad = 0;
        productos.forEach((item) => {
            total += item.Cantidad * producto.Monto;
            cantidad += item.Cantidad;
        });
        setCantidad(cantidad)
        setSuma(total)
    }
    //Agregar cantidad
    const addCantidad = (key, item) => {
        let count = 0; 
        const items = [...productos];
        count = items[item].Cantidad += 1;
        if (count > producto.CantidadMaxima) {
            toast('No puedes pedir mas de la cantidad maxima', 3000);
        } else {
            setProductos(items);
            sumatoria();

            if(count == 1){
                setProd(prod => [...prod, key]);
            }if(count > 1){
                prod.filter(item => {
                    if (item.OfertaId.includes(key.OfertaId)) {
                        setProd([]); setProd(prod => [...prod, key]);
                    }else{
                        setProd(prod => [...prod, key]);
                    }
                })
            }
            //setProd(...prod, {'OfertaId': key.OfertaId, 'ProductoId': key.ProductoId, 'Cantidad': key.Cantidad});
            //setProd(prod => [...prod, key]); //{'OfertaId': key.OfertaId, 'ProductoId': key.ProductoId, 'Cantidad': key.Cantidad}
        }
    }
    //Remover cantidad
    const removeCantidad = (key, item) => {
        let count = 0;
        const items = [...productos];
        count = items[item].Cantidad -= 1;
        if (items[item].Cantidad > producto.CantidadMaxima) {
            toast('No puedes pedir menos de la cantidad minima', 3000);
        } else {
            setProductos(items);
            sumatoria();

            if(count == 1){
                setProd(prod => [...prod, key]);
            }else{
                prod.filter(item => {
                    if (item.OfertaId.includes(key.OfertaId)) {
                        setProd([]); setProd(prod => [...prod, key]);
                    }else{
                        setProd(prod => [...prod, key]);
                    }
                })
            }
        }
    }
    //Agregando a carrito
    const addCarrito = async () => {
        if (suma !== 0) {
            //alert(JSON.stringify(producto.ClienteId)); 

            var costoEnvio = 1.5;
            var iva = 12.0;
            var sinIva = parseFloat(suma);
            var conIva = parseFloat((12.0 / 100) * suma);
            var ivaCalculo = parseFloat(((12.0 / 100) * suma) + costoEnvio * 0.12);
            var totalApagar = costoEnvio + suma + iva;

            var calculo = {
                'CostoEnvio': costoEnvio * cantidad,
                //'ValorSinIva': sinIva,
                //'ValorConIva': conIva,
                'ValorTotalSinIva': suma,
                'ValorTotalSinIce': suma,
                //'ValorICE': (10.0 / 100) * suma,
                'ValorSinIce': suma,
                //'ValorTotal': totalApagar,
                'Cantidad': cantidad
            }
            await addPedido(calculo);
            //alert(JSON.stringify(prod))
        } else {
            toast('Verifica los limites de este producto', 3000)
        }
    }

    //Agregar pedido y detalel del item
    const addPedido = async (calculo) => {
        await fetch(`${global.config.appConfig.url.dev}POC_Pedido`, {
            method: 'POST',
            headers: global.config.appConfig.headers.dev,
            body: JSON.stringify({
                'ClienteId': producto.ClienteId,
                'ProductoId': producto.ProductoId,
                'OfertaId': producto.OfertaId,
                'UnidadMedidaId': producto.UnidadMedidaId,
                'PrecioUnitario': producto.Monto,
                'ZonaId': producto.ZonaId,
                'CalendarioId': producto.CalendarioId,
                'LocalId': producto.LocalId,
                'CostoServicioId': 'C93A064A-09BF-42AE-B9E7-790D200EB53D',
                'FormaPagoId': 'C261C3F9-9A6F-43DC-8965-55E0FDE78674',
                'FormaDespachoId': 'DA825A35-3479-4E39-839B-4CA5703BA18F',
                'OrdenDespachoId': 'E89856C0-1571-4A8C-A455-E567BE8A6FE4',
                'EstadoId': 'E93E6B6E-0EC8-4BDA-B575-D0168BA3A561',
                //'ValorSinIva': calculo.ValorSinIva,
                //'ValorConIva': calculo.ValorConIva,
                //'ValorTotalSinIva': calculo.ValorTotalSinIva,
                //'ValorTotalSinIce': calculo.ValorTotalSinIce,
                'ValorICE': calculo.ValorICE,
                //'ValorTotal': calculo.ValorTotal,
                'CostoEnvio': calculo.CostoEnvio,
                'Iva': producto.Iva,
                'ValorSinIce': calculo.ValorSinIce,
                'Cantidad': calculo.Cantidad,
                'Items': prod
            }),
            json: true
        }).then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return promisePedido(response.json())
            }
            else { // si no se obtiene una respuesta
                response.json().then((json) => {
                    const { Message, StrackTraceString } = json;
                });
                return null
            }
        }).catch(e => { console.log(e); });
    }

    const promisePedido = async (req) => {
        (await Promise.all([req])).map((items) => {
            if (items) {
                toast('Producto agregado al carrito', 3000);
                props.open('');      
                countItems(items);
            }
        })
    }

    //Consultamos lista de Productos disponibles desde el api
    const getProductos = async (clienteId, producto, fecha) => {
        if (clienteId !== '' && producto !== '' && fecha !== '') {
            setActivity(true);
            var result = await fetch(`${global.config.appConfig.url.dev}PPN_Producto?clienteId=${clienteId}&productoId=${producto}&fechaInicio=${fecha}`, {
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
                return setProductos(result)
            }
        } else {
            if (buscar === '') {
                toast('Debes colocar producto a buscar', 3000)
            }
            setTimeout(() => {
                setErrorBuscar(false);
            }, 3000)
        }
    }
    //alert(JSON.stringify(props))

    useEffect(() => {
        getProductos(producto.ClienteId, producto.ProductoId, Moment(fechaInicio).subtract(-1, 'days').format('YYYY-MM-DD HH:mm:ss'));
    }, []);

    return (
        <View>
            {(producto !== '') ?
                recodar ? (
                    <Recordatorio item={producto} open={openRecordatorio} />
                ) : (
                        <ScrollView style={{ marginTop: -18 }}>
                                <View>
                                    <TouchableOpacity onPress={() => props.open('')}>
                                        <Card style={{ alignItems: 'center', marginTop: 0 }}>
                                            <CardItem style={{ paddingBottom: -5, paddingTop: -5 }}>
                                                <Icon name={'chevron-left'} color="black" size={34} />
                                            </CardItem>
                                        </Card>
                                    </TouchableOpacity>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ alignItems: 'center', flexDirection: 'row', alignSelf: 'center' }}>
                                            <View style={{ alignItems: 'flex-start', right: 100 }}>
                                                <TouchableOpacity>
                                                    <Icon name={'caret-left'} color="black" size={34} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ alignItems: 'center' }}>
                                                <Thumbnail square large source={{ uri: `data:image/jpeg;base64,${producto.Image}` }} />
                                            </View>
                                            <View style={{ alignItems: 'flex-end', left: 100 }}>
                                                <TouchableOpacity>
                                                    <Icon name={'caret-right'} color="black" size={34} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                    </View>

                                    <Card style={{ flex: 1 }} key={producto.ProductoId}>
                                        <CardItem>
                                            <Left>
                                                <Body>
                                                    <Text style={styles.titulo}>{producto.Nombre}</Text>
                                                    <Text style={styles.local}>{producto.Local}</Text>
                                                    <Text style={styles.um}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(producto.Monto)} por cada {producto.UnidadMedida}</Text>
                                                </Body>
                                            </Left>

                                        </CardItem>
                                    </Card>
                                    {productos.map((key, item) => (
                                        <Card key={item}>
                                            <CardItem>
                                                <View style={{ flex: 1 }}>
                                                    <View style={{ alignItems: 'flex-start' }}>
                                                        <Label>Fecha máxima de pedidos:</Label>
                                                        <Text style={styles.tiempo}>{Moment(productos[item].FechaHoraCierrePedido).format('dddd')} {Moment(productos[item].FechaHoraCierrePedido).format('DD-MM-YYYY LT')}</Text>
                                                    </View>
                                                    <View style={{ alignItems: 'flex-start' }}>
                                                        <Label>Fecha entrega:</Label>
                                                        <Text style={styles.tiempo}>{Moment(productos[item].FechaHoraEntrega).format('dddd')} {Moment(productos[item].FechaHoraEntrega).format('DD-MM-YYYY LT')}</Text>
                                                    </View>
                                                    <View style={{ alignItems: 'center', flexDirection: 'row', alignSelf: 'center' }}>
                                                        <TouchableOpacity onPress={() => addCantidad(key, item)} style={{ alignItems: 'flex-start' }}>
                                                            <Icon name={'plus'} color="black" size={34} />
                                                        </TouchableOpacity>
                                                        <View style={{ alignItems: 'center' }}>
                                                            <Badge style={{ backgroundColor: '#fff' }}>
                                                                <Text style={{ fontSize: 20, padding: 18 }}>{productos[item].Cantidad}</Text>
                                                            </Badge>
                                                        </View>
                                                        <TouchableOpacity onPress={() => removeCantidad(key, item)} style={{ alignItems: 'flex-end' }}>
                                                            <Icon name={'minus'} color="black" size={34} />
                                                            {/* <Text>{productos[item].OfertaId}</Text> */}
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </CardItem>
                                        </Card>
                                    ))}

                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'column', paddingTop: 15 }}>
                                            <TouchableOpacity>
                                                <Button onPress={() => addCarrito()} title={`Agregar a carrito ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(suma)}`}></Button>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'column', paddingTop: 15 }}>
                                            <TouchableOpacity>
                                                <Button onPress={() => openRecordatorio(true)} title={'Compra recurrente'}></Button>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'column', paddingTop: 15 }}>
                                            <TouchableOpacity>
                                                <Button onPress={() => openRecordatorio(true)} title={'Recordarme compra más adelante'}></Button>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                        </ScrollView>
                    )

                :
                <View style={{ flex: 1, marginTop: 140 }}>
                    <ActivityIndicator size={88} color="blue" />
                </View>
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
        fontSize: 22,
        fontWeight: 'bold',
    },
    local: {
        fontSize: 20,
        fontWeight: 'normal',
    },
    um: {
        fontSize: 16,
        color: '#b71c1c',
    },
    tiempo: {
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'capitalize',
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

export default Detalle;
