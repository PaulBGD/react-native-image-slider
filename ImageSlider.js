import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
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
    image: {
        width: Dimensions.get('window').width
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
            left: new Animated.Value(0),
            scrolling: false,
            timeout: null
        };
    }

    _move(index) {
        const width = Dimensions.get('window').width;
        const to = index * -width;
        if (!this.state.scrolling) {
            return;
        }
        Animated.spring(this.state.left, {toValue: to, friction: 10, tension: 50}).start();
        if (this.state.timeout) {
            clearTimeout(this.state.timeout);
        }
        this.setState({position: index, timeout: setTimeout(() => {
            this.setState({scrolling: false, timeout: null});
            if (this.props.onPositionChanged) {
                this.props.onPositionChanged(index);
            }
        }, 500)});
    }

    _getPosition() {
        if (typeof this.props.position === 'number') {
            return this.props.position;
        }
        return this.state.position;
    }

    componentWillReceiveProps(props) {
        if (props.position !== undefined) {
            this.setState({scrolling: true});
            this._move(props.position);
        }
    }

    componentWillMount() {
        const width = Dimensions.get('window').width;

        if (typeof this.props.position === 'number') {
            this.state.left.setValue(-(width * this.props.position));
        }

        let release = (e, gestureState) => {
            const width = Dimensions.get('window').width;
            const relativeDistance = gestureState.dx / width;
            const vx = gestureState.vx;
            let change = 0;

            if (relativeDistance < -0.5 || (relativeDistance < 0 && vx <= 0.5)) {
                change = 1;
            } else if (relativeDistance > 0.5 || (relativeDistance > 0 && vx >= 0.5)) {
                change = -1;
            }
            const position = this._getPosition();
            if (position === 0 && change === -1) {
                change = 0;
            } else if (position + change >= this.props.images.length) {
                change = (this.props.images.length) - (position + change);
            }
            this._move(position + change);
            return true;
        };

        const isSwipe = gestureState => gestureState.dx>0 && gestureState.dy>0;
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => isSwipe(gestureState),
            onStartShouldSetPanResponderCapture: (evt, gestureState) => isSwipe(gestureState),
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderRelease: release,
            onPanResponderTerminate: release,
            onPanResponderMove: (e, gestureState) => {
                const dx = gestureState.dx;
                const width = Dimensions.get('window').width;
                const position = this._getPosition();
                let left = -(position * width) + Math.round(dx);
                if (left > 0) {
                    left = Math.sin(left / width) * (width / 2);
                } else if (left < -(width * (this.props.images.length - 1))) {
                    const diff = left + (width * (this.props.images.length - 1));
                    left = Math.sin(diff / width) * (width / 2) - (width * (this.props.images.length - 1));
                }
                this.state.left.setValue(left);
                if (!this.state.scrolling) {
                    this.setState({scrolling: true});
                }
            },
            onShouldBlockNativeResponder: () => true
        });
    }

    componentWillUnmount() {
        if (this.state.timeout) {
            clearTimeout(this.state.timeout);
        }
    }

    render() {
        const backgroundColor = this.props.backgroundColor ? { backgroundColor: this.props.backgroundColor } : {};
        const width = Dimensions.get('window').width;
        const height = this.props.height || this.state.height;
        const position = this._getPosition();
        return (<View>
            <Animated.View
                style={[styles.container, backgroundColor, {height: height, width: width * this.props.images.length, transform: [{translateX: this.state.left}]}]}
                {...this._panResponder.panHandlers}>
                    {this.props.images.map((image, index) => {
                      const imageComponent = <Image
                                                source={{uri: image}}
                                                style={{height: position === index || this.state.scrolling ? height : 0, width}}
                                              />;
                      if (this.props.onPress) {
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => this.props.onPress({ image, index })}
                            delayPressIn={200}
                          >
                            {imageComponent}
                          </TouchableOpacity>
                        );
                      } else {
                        return imageComponent;
                      }
                    })}
            </Animated.View>
            <View style={styles.buttons}>
                {this.props.images.map((image, index) => {
                    return (<TouchableHighlight
                        key={index}
                        underlayColor="#ccc"
                        onPress={() => {
                            this.setState({scrolling: true});
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
