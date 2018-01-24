// @flow

import React, { type Node, Component } from 'react';
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
  Dimensions,
} from 'react-native';

const reactNativePackage = require('react-native/package.json');
const splitVersion = reactNativePackage.version.split('.');
const majorVersion = +splitVersion[0];
const minorVersion = +splitVersion[1];

type PropsType = {
  images: string[],
  style?: any,
  autoPlayWithInterval?: number,
  position?: number,
  onPositionChanged?: number => void,
  onPress?: Object => void,
  customButtons?: (number, (number) => void) => Node,
};

type StateType = {
  position: number,
  width: number,
  scrolling: boolean,
  interval: any,
};

class ImageSlider extends Component<PropsType, StateType> {
  state = {
    position: 0,
    width: Dimensions.get('window').width,
    scrolling: false,
    interval: null,
  };

  _ref = null;
  _panResponder = {};

  _onRef = (ref: any) => {
    this._ref = ref;
    if (ref && this.state.position !== this._getPosition()) {
      this._move(this._getPosition());
    }
  };

  _move = (index: number) => {
    const isUpdating = index !== this._getPosition();
    const x = this.state.width * index;
    if (majorVersion === 0 && minorVersion <= 19) {
      this._ref && this._ref.scrollTo(0, x, true); // use old syntax
    } else {
      this._ref && this._ref.scrollTo({ animated: true, y: 0, x });
    }
    this.setState({ position: index });
    if (isUpdating && this.props.onPositionChanged) {
      this.props.onPositionChanged(index);
    }

    this._setInterval();
  };

  _getPosition() {
    if (typeof this.props.position === 'number') {
      return this.props.position;
    }
    return this.state.position;
  }

  componentDidUpdate(prevProps: Object) {
    const { position } = this.props;

    if (position && prevProps.position !== position) {
      this._move(position);
    }
  }

  _clearInterval = () =>
    this.state.interval && clearInterval(this.state.interval);

  _setInterval = () => {
    this._clearInterval();
    const { autoPlayWithInterval, images } = this.props;

    if (autoPlayWithInterval) {
      this.setState({
        interval: setInterval(
          () =>
            this._move(
              this.state.position === images.length - 1
                ? 0
                : this.state.position + 1,
            ),
          autoPlayWithInterval,
        ),
      });
    }
  };

  componentWillMount() {
    let release = (e, gestureState) => {
      const { width } = this.state;
      const relativeDistance = gestureState.dx / width;
      const vx = gestureState.vx;
      let change = 0;

      if (relativeDistance < -0.5 || (relativeDistance < 0 && vx <= 0.5)) {
        change = 1;
      } else if (
        relativeDistance > 0.5 ||
        (relativeDistance > 0 && vx >= 0.5)
      ) {
        change = -1;
      }
      const position = this._getPosition();
      if (position === 0 && change === -1) {
        change = 0;
      } else if (position + change >= this.props.images.length) {
        change = this.props.images.length - (position + change);
      }
      this._move(position + change);
      return true;
    };

    this._panResponder = PanResponder.create({
      onPanResponderMove: this._clearInterval,
      onPanResponderRelease: release,
    });

    this._setInterval();
  }

  componentWillUnmount() {
    this._clearInterval();
  }

  _onLayout = () => {
    this.setState({ width: Dimensions.get('window').width });
    this._move(this._getPosition());
  };

  render() {
    const { onPress, customButtons, style } = this.props;
    const { width } = this.state;
    const position = this._getPosition();

    return (
      <View style={styles.container} onLayout={this._onLayout}>
        <ScrollView
          ref={ref => this._onRef(ref)}
          decelerationRate={0.99}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          {...this._panResponder.panHandlers}
          style={[styles.scrollViewContainer, style || { height: '100%' }]}
        >
          {this.props.images.map((image, index) => {
            const imageObject =
              typeof image === 'string' ? { uri: image } : image;
            const imageComponent = (
              <Image
                key={index}
                source={imageObject}
                style={[styles.image, { width }]}
              />
            );
            if (this.props.onPress) {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.image}
                  onPress={() => onPress && onPress({ image, index })}
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
        {customButtons ? (
          customButtons(position, this._move)
        ) : (
          <View style={styles.buttons}>
            {this.props.images.map((image, index) => (
              <TouchableHighlight
                key={index}
                underlayColor="#ccc"
                onPress={() => this._move(index)}
                style={[
                  styles.button,
                  position === index && styles.buttonSelected,
                ]}
              >
                <View />
              </TouchableHighlight>
            ))}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    flexDirection: 'row',
    backgroundColor: '#222',
  },
  image: {
    width: 200,
    height: '100%',
  },
  buttons: {
    height: 15,
    marginTop: -25,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    margin: 3,
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    backgroundColor: '#ccc',
    opacity: 0.9,
  },
  buttonSelected: {
    opacity: 1,
    backgroundColor: '#fff',
  },
});

export default ImageSlider;
