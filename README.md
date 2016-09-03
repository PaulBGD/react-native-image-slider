# react-native-image-slider
A quick and easy image slider for react native.

![GIF](final.gif)

## Installation

```bash
npm install react-native-image-slider --save
```

## Usage

```javascript
import ImageSlider from 'react-native-image-slider';

// ...

render() {
    return (<ImageSlider images={[
        'http://placeimg.com/640/480/any',
        'http://placeimg.com/640/480/any',
        'http://placeimg.com/640/480/any'
    ]}/>)
}
```

To keep the height from shifting, we use a static height.
If you want to change the height, simply pass a height to the component.

### Props

* `height`: controls the height. By default the height is static, is this if you want the height to change
* `onPositionChanged`: called when the current position is changed
* `position`: used for controlled components
* `onPress`: returns an object with image url and index of image pressed
* `style`: add custom styles

### Autoplay Example

```javascript
class SliderTests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            position: 1,
            interval: null
        };
    }

    componentWillMount() {
        this.setState({interval: setInterval(() => {
            this.setState({position: this.state.position === 2 ? 0 : this.state.position + 1});
        }, 2000)});
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    render() {
        return (
            <View style={styles.container}>
                <ImageSlider
                    images={[
                        `http://placeimg.com/640/480/any`,
                        `http://placeimg.com/640/480/any`,
                        `http://placeimg.com/640/480/any`,
                    ]}
                    position={this.state.position}
                    onPositionChanged={position => this.setState({position})}/>
            </View>
        );
    }
}
```

## To Do

Please feel free to fork and PR!

* Add the option for custom buttons

## License

MIT
