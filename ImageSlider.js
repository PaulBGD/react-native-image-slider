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
  loop?: boolean,
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

  _loop = (event: any) =>
    this.props.loop &&
    event.nativeEvent.contentOffset.x ===
      this.state.width * this.props.images.length &&
    this._move(0, false);

  _move = (index: number, animated: boolean = true) => {
    const isUpdating = index !== this._getPosition();
    const x = this.state.width * index;

    if (majorVersion === 0 && minorVersion <= 19) {
      this._ref && this._ref.scrollTo(0, x, animated); // use old syntax
    } else {
      this._ref && this._ref.scrollTo({ y: 0, x, animated });
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
    const { autoPlayWithInterval, images, loop } = this.props;

    if (autoPlayWithInterval) {
      this.setState({
        interval: setInterval(
          () =>
            this._move(
              !loop && this.state.position === images.length - 1
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
      const { images, loop } = this.props;
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
      } else if (position + change >= images.length) {
        change = loop ? 1 : images.length - (position + change);
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

  _renderImage = (image: any, index: number) => {
    const { width } = this.state;
    const { onPress } = this.props;
    const imageObject = typeof image === 'string' ? { uri: image } : image;
    const imageComponent = (
      <Image
        key={index}
        source={imageObject}
        style={[styles.image, { width }]}
      />
    );

    if (onPress) {
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
  };

  render() {
    const { onPress, customButtons, style, loop, images } = this.props;
    const position = this._getPosition();

    return (
      <View style={styles.container} onLayout={this._onLayout}>
        <ScrollView
          ref={ref => this._onRef(ref)}
          decelerationRate={0.99}
          horizontal={true}
          onScroll={this._loop}
          showsHorizontalScrollIndicator={false}
          {...this._panResponder.panHandlers}
          style={[styles.scrollViewContainer, style || { height: '100%' }]}
        >
          {images.map(this._renderImage)}
          {loop && this._renderImage(images[0], images.length)}
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
