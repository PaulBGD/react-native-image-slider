# react-native-image-slider

A quick and easy image slider for react native.

![GIF](final.gif)

## Installation

```bash
npm install react-native-image-slider --save
```
or
```bash
yarn add react-native-image-slider
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

### Autoplay / Custom buttons / Custom slide / Loop

```javascript
class Example extends Component<{}> {
  render() {
    const images = [
      'https://placeimg.com/640/640/nature',
      'https://placeimg.com/640/640/people',
      'https://placeimg.com/640/640/animals',
      'https://placeimg.com/640/640/beer',
    ];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content1}>
          <Text style={styles.contentText}>Content 1</Text>
        </View>
        <ImageSlider
          loopBothSides
          autoPlayWithInterval={3000}
          images={images}
          customSlide={({ index, item, style, width }) => (
            // It's important to put style here because it's got offset inside
            <View key={index} style={[style, styles.customSlide]}>
              <Image source={{ uri: item }} style={styles.customImage} />
            </View>
          )}
          customButtons={(position, move) => (
            <View style={styles.buttons}>
              {images.map((image, index) => {
                return (
                  <TouchableHighlight
                    key={index}
                    underlayColor="#ccc"
                    onPress={() => move(index)}
                    style={styles.button}
                  >
                    <Text style={position === index && styles.buttonSelected}>
                      {index + 1}
                    </Text>
                  </TouchableHighlight>
                );
              })}
            </View>
          )}
        />
        <View style={styles.content2}>
          <Text style={styles.contentText}>Content 2</Text>
        </View>
      </SafeAreaView>
    );
  }
}
```

## Props

### `images`

rendered images

### `customButtons`

function returns custom pagination buttons component, it's got position index and move to position function as arguments

### `customSlide`

function returns Node with arguments `index` - images list index, `item` - anything you pass inside images prop, `style` - for top component of your custom slide, `width` - calculated slide width

### `autoPlayWithInterval`

activates autoplay when passed (it uses milliseconds)

### `loop`

[BUGGY ON ANDROID] loops scroll of images, but in one direction only

### `loopBothSides`

[IOS ONLY] same as loop, but does it in any direction

### `onPositionChanged`

called when the current position is changed

### `position`

used for controlled components

### `onPress`

returns an object with image url and index of image pressed

### `style`

styles ScrollView inside ImageSlider, you may pass height here (100% by default)

## License

MIT
