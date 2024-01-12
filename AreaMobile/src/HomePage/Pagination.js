import { StyleSheet, View } from 'react-native';
import React from 'react';

export default function Pagination({ activeIndex, itemCount }) {
  const array = new Array(itemCount).fill(0);
    
  return (
    <View style={styles.paginationContainer}>
      {array.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            activeIndex === index ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};
  
const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'blue',
  },
  inactiveDot: {
    backgroundColor: 'rgba(0, 0, 255, 0.2)'
  },
});
