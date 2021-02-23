import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import MapView, {
    MAP_TYPES,
    Polygon,
    ProviderPropType,
    Marker,
    Callout,
    Polyline,
} from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            region: {
                latitude: props.props.coords.latitude ? props.props.coords.latitude : null,
                longitude: props.props.coords.longitude ? props.props.coords.longitude : null,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            },
            polygons: [],
            //poligono: this.props.poligono,
            editing: null,
            creatingHole: false,
            //estado: this.props.estado,
            //latitude: this.props.zona.Latitude ? this.props.zona.Latitude : null,
            //longitude: this.props.zona.Longitude ? this.props.zona.Longitude : null,
            //zona: this.props.zona.Nombre ? this.props.zona.Nombre : '',
            //poligonos: this.props.zona.Poligono ? JSON.parse(this.props.zona.Poligono) : null,
            coords: [
                { latitude: 10.157901817617825, longitude: -64.64172818413077 },
                { latitude: 10.154944817343763, longitude: -64.64226462593375 },
                { latitude: 10.15519827558131, longitude: -64.63773705711661 },
                { latitude: 10.157014720406249, longitude: -64.6364925121337 },
                { latitude: 10.158113030876939, longitude: -64.63692166557608 },
                { latitude: 10.158282001383787, longitude: -64.63829495659171 },
                { latitude: 10.15931694378988, longitude: -64.63934638252555 },
                { latitude: 10.159359186265917, longitude: -64.6415350650817 },
                { latitude: 10.15845097180133, longitude: -64.64228608360587 }
            ]
        };
    }

    move(coords) {
        //alert(JSON.stringify(coords));
        this.props.newPosition(coords)
    }

    finish() {
        const { polygons, editing } = this.state;
        this.setState({
            polygons: [...polygons, editing],
            editing: null,
            creatingHole: false,
            poligono: polygons,
        });
        if (polygons.length !== 0) {
            this.props.poligono(JSON.stringify(polygons))
        }
    }

    createHole() {
        const { editing, creatingHole } = this.state;
        if (!creatingHole) {
            this.setState({
                creatingHole: true,
                editing: {
                    ...editing,
                    holes: [...editing.holes, []],
                },
            });
        } else {
            const holes = [...editing.holes];
            if (holes[holes.length - 1].length === 0) {
                holes.pop();
                this.setState({
                    editing: {
                        ...editing,
                        holes,
                    },
                });
            }
            this.setState({ creatingHole: false });
        }
    }

    onPress(e) {
        const { editing, creatingHole } = this.state;
        if (!editing) {
            this.setState({
                editing: {
                    //id: id++,
                    coordinates: [e.nativeEvent.coordinate],
                    holes: [],
                },
            });
        } else if (!creatingHole) {
            this.setState({
                editing: {
                    ...editing,
                    coordinates: [...editing.coordinates, e.nativeEvent.coordinate],
                },
            });
        } else {
            const holes = [...editing.holes];
            holes[holes.length - 1] = [
                ...holes[holes.length - 1],
                e.nativeEvent.coordinate,
            ];
            this.setState({
                editing: {
                    ...editing,
                    //id: id++, // keep incrementing id to trigger display refresh
                    coordinates: [...editing.coordinates],
                    holes,
                },
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    provider={this.props.provider} // remove if not using Google Maps
                    style={styles.map}
                    zoomEnabled={true}
                    initialRegion={this.state.region}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsMyLocationButton={true}
                    showsPointsOfInterest={true}
                    focusable={true}
                    zoomTapEnabled
                    zoomControlEnabled
                    isAccessibilityElement
                >
                    {/* <View key={1}>
                        <Polygon
                            coordinates={this.state.coords}
                            tappable
                            geodesic
                            strokeColor="red"
                        />
                    </View> */}
                    <Marker
                        coordinate={this.state.region}
                        draggable
                        collapsable
                        focusable
                        flat
                        onDragEnd={(e) => this.move(e.nativeEvent.coordinate)}
                    > 
                    </Marker>
                </MapView>
            </View>
        );
    }
}

Map.propTypes = {
    provider: ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: 500,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bubble: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    latlng: {
        width: 200,
        alignItems: 'stretch',
    },
    button: {
        width: 100,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 80,
        backgroundColor: 'transparent',
    },
});

export default Map;