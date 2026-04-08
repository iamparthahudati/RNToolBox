import React, { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, StyleSheet, View } from 'react-native';
import colors from '../../theme/colors';

const AppMask = () => {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const [masked, setMasked] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        const isBackground =
          nextState === 'background' || nextState === 'inactive';
        const wasActive = appState.current === 'active';

        if (isBackground && wasActive) {
          setMasked(true);
        } else if (nextState === 'active') {
          setMasked(false);
        }

        appState.current = nextState;
      },
    );

    return () => subscription.remove();
  }, []);

  if (!masked) {
    return null;
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.mask} />
    </View>
  );
};

const styles = StyleSheet.create({
  mask: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },
});

export default AppMask;
