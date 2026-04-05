import React from 'react';
import { FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';
import { MenuItem } from '../../../types/menu';
import Header from '../../atoms/Header';
import MenuCard from '../MenuCard';

type ScreenLayoutProps = {
  title: string;
  headerRight?: React.ReactNode;
} & (
  | {
      items: MenuItem[];
      onItemPress: (item: MenuItem) => void;
      children?: never;
    }
  | { children: React.ReactNode; items?: never; onItemPress?: never }
);

const ScreenLayout = ({ title, headerRight, ...rest }: ScreenLayoutProps) => {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title={title} headerRight={headerRight} />

      {'items' in rest && rest.items !== undefined ? (
        <FlatList
          data={rest.items}
          keyExtractor={item => item.title}
          renderItem={({ item }) => (
            <MenuCard
              title={item.title}
              description={item.description}
              implemented={item.implemented}
              icon={(item as any).icon ?? 'view-grid-outline'}
              onPress={() => rest.onItemPress!(item)}
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.xxl,
          }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.xxl,
          }}
        >
          {(rest as { children: React.ReactNode }).children}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ScreenLayout;
