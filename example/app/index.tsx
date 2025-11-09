import { Text, View, StyleSheet, TouchableHighlight, Image } from "react-native";
import ImageSlider from 'react-native-image-slider';

function App() {
  const images = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb', // Nature
    'https://images.unsplash.com/photo-1517841905240-472988babdf9', // People
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca', // Animals
    'https://images.unsplash.com/photo-1514361892635-cebb006cb6b4', // Beer (Pub)
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content1}>
        <Text style={styles.contentText}>Content 1</Text>
      </View>
      <ImageSlider
        loop
        autoPlayWithInterval={3000}
        images={images}
        onPress={({ index }) => alert(index)}
        customSlide={({ index, item, style, width }) => (
          // It's important to put style here because it's got offset inside
          <View
            key={index}
            style={[
              style,
              styles.customSlide,
              { backgroundColor: index % 2 === 0 ? 'yellow' : 'green' },
            ]}
          >
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
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  slider: { backgroundColor: '#000', height: 350 },
  content1: {
    width: '100%',
    height: 50,
    marginBottom: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content2: {
    width: '100%',
    height: 100,
    marginTop: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: { color: '#fff' },
  buttons: {
    zIndex: 1,
    height: 15,
    marginTop: -25,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    margin: 3,
    width: 15,
    height: 15,
    opacity: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSelected: {
    opacity: 1,
    color: 'red',
  },
  customSlide: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customImage: {
    width: 100,
    height: 100,
  },
});

export default App