# react-native-image-slider
An quick and easy image slider for react native.

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

## To Do

Please feel free to fork and PR!

* Add an event when the image changes
* Add the option for custom buttons

## License

MIT
