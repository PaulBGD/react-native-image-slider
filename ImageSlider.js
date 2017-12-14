import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    ScrollView,
    StyleSheet,
    Animated,
    PanResponder,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#222'
    },
    buttons: {
        height: 15,
        marginTop: -15,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    button: {
        margin: 3,
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: '#ccc',
        opacity: 0.9
    },
    buttonSelected: {
        opacity: 1,
        backgroundColor: '#fff',
    }
});

export default class ImageSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            position: 0,
            height: Dimensions.get('window').width,
            width: Dimensions.get('window').width,
            scrolling: false,
        };

        this._handleScroll = this._handleScroll.bind(this);
    }

    _move(index) {
        const width = this.props.width || this.state.width;
        const isUpdating = index !== this._getPosition();
        const x = width * index;
        this.setState({position: index});
        if (isUpdating && this.props.onPositionChanged) {
            this.props.onPositionChanged(index);
        }
    }

    _getPosition() {
        if (typeof this.props.position === 'number') {
            return this.props.position;
        }
        return this.state.position;
    }

    _handleScroll(event) {
        const width = this.props.width || this.state.width
        const index = Math.round(event.nativeEvent.contentOffset.x / width)
        this._move(index)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.position !== this.props.position) {
            this._move(this.props.position);
        }
    }

    render() {
        const width = this.props.width || this.state.width;
        const height = this.props.height || this.state.height;
        const position = this._getPosition();
        return (<View>
            <ScrollView
                decelerationRate={"fast"}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={this._handleScroll}
                scrollEventThrottle={16}
                pagingEnabled={true}
                style={[styles.container, this.props.style, {height: height}]}>
                {this.props.images.map((image, index) => {
                    const imageObject = typeof image === 'string' ? {uri: image} : image;
                    const imageComponent = <Image
                        key={index}
                        source={imageObject}
                        style={[this.props.imageStyle, {height, width}]}
                    />;
                    if (this.props.onPress) {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={{height, width}}
                                onPress={() => this.props.onPress({image, index})}
                                delayPressIn={200}
                            >
                                {imageComponent}
                            </TouchableOpacity>
                        );
                    } else {
                        return imageComponent;
                    }
                })}
            </ScrollView>
            <View style={styles.buttons}>
                {this.props.images.map((image, index) => {
                    return (<TouchableHighlight
                        key={index}
                        underlayColor="#ccc"
                        onPress={() => {
                            return this._move(index);
                        }}
                        style={[styles.button, position === index && styles.buttonSelected]}>
                        <View></View>
                    </TouchableHighlight>);
                })}
            </View>
        </View>);
    }
}
