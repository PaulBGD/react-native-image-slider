import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    ScrollView,
    StyleSheet,
    PanResponder,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions
} from 'react-native';

const reactNativePackage = require('react-native/package.json');
const splitVersion = reactNativePackage.version.split('.');
const majorVersion = +splitVersion[0];
const minorVersion = +splitVersion[1];

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5'
    },
    buttons: {
        height: 15,
        marginTop: -15,
        flex: 1,
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
            height: Dimensions.get('window').width * (4 / 9),
            width: Dimensions.get('window').width,
            scrolling: false,
        };
    }

    _onRef(ref) {
        this._ref = ref;
        if (ref && this.state.position !== this._getPosition()) {
            this._move(this._getPosition());
        }
    }

    _scrollTo = majorVersion === 0 && minorVersion <= 19 
        ? (opts) => {
            this._ref.scrollTo(opts.y, opts.x, opts.animated); // use old syntax
        }
        : (opts) => {
            this._ref.scrollTo({x: opts.x, y: opts.y, animated: opts.animated});
        }

    _move(index, flag) {
        const isUpdating = index !== this._getPosition();

        //Since ScrollView not support AnimationEnd event with android
        if (index >= this.props.images.length) {
            setTimeout(function () {
                this._scrollTo({x: this.state.width * (0 + 1), y: 0, animated: false});
            }.bind(this), 200);
        } else if (index < 0) {
            setTimeout(function () {
                this._scrollTo({x: this.state.width * (this.props.images.length), y: 0, animated: false});
            }.bind(this), 200);
        }
        this._scrollTo({x: this.state.width * (index + 1), y: 0, animated: flag == undefined ? true : flag});

        index = (index < 0 ? (index + this.props.images.length) : index) % this.props.images.length;

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

    componentDidUpdate(prevProps) {
        if (prevProps.position !== this.props.position) {
            this._move(this.props.position);
        }
    }

    componentDidMount() {
        this._ref.scrollTo({x: this.state.width, y: 0, animated: false});
    }

    componentWillMount() {
        const width = this.state.width;

        let release = (e, gestureState) => {
            const width = this.state.width;
            const relativeDistance = gestureState.dx / width;
            const vx = gestureState.vx;
            let change = 0;

            if (relativeDistance < -0.5 || (relativeDistance < 0 && vx <= 0.5)) {
                change = 1;
            } else if (relativeDistance > 0.5 || (relativeDistance > 0 && vx >= 0.5)) {
                change = -1;
            }

            let position = this._getPosition();

            this._move(position + change);
            return true;
        };

        this._panResponder = PanResponder.create({
            onPanResponderRelease: release
        });

        this._interval = setInterval(() => {
            const newWidth = Dimensions.get('window').width;
            if (newWidth !== this.state.width) {
                this.setState({width: newWidth});
            }
        }, 16);
    }

    componentWillUnmount() {
        clearInterval(this._interval);
    }

    render() {
        const width = this.state.width;
        const height = this.props.height || this.state.height;
        const position = this._getPosition();

        const images = [].concat(this.props.images);
        images.push(this.props.images[0]);
        images.unshift(this.props.images[this.props.images.length - 1]);

        return (<View>
            <ScrollView
                ref={ref => this._onRef(ref)}
                decelerationRate={0.8}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                {...this._panResponder.panHandlers}
                style={[styles.container, this.props.style, {height: height}]}>
                {images.map((image, index) => {
                    const imageObject = typeof image === 'string' ? {uri: image} : image;
                    return (
                        <Image
                            key={index}
                            source={imageObject}
                            style={{height, width}}/>
                    )
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
