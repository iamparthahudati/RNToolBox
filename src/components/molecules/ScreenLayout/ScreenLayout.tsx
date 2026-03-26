import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../theme';
import { MenuItem } from '../../../types/menu';
import Header from '../../atoms/Header';
import MenuCard from '../MenuCard';

type ScreenLayoutProps = {
  title: string;
  items: MenuItem[];
  onItemPress: (item: MenuItem) => void;
};

const ScreenLayout = ({ title, items, onItemPress }: ScreenLayoutProps) => (
  <SafeAreaView style={styles.container}>
    <Header title={title} />
    <FlatList
      data={items}
      keyExtractor={item => item.title}
      renderItem={({ item }) => (
        <MenuCard
          title={item.title}
          description={item.description}
          implemented={item.implemented}
          onPress={() => onItemPress(item)}
        />
      )}
      contentContainerStyle={styles.list}
    />
  </SafeAreaView>
);

export default ScreenLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
});
