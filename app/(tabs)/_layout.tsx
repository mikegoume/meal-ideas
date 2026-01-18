import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf={'house.fill'} drawable="ic_menu_mylocation" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <Label>Favorites</Label>
        <Icon sf={'heart.fill'} drawable="ic_menu_mylocation" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon
          sf={'gearshape.arrow.trianglehead.2.clockwise.rotate.90'}
          drawable="ic_menu_mylocation"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
