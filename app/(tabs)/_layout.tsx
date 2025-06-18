import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarShowLabel: false,
      headerShown: false,
      tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: 'black',
        borderTopColor: 'transparent',
        borderTopWidth: 0,
        elevation: 0,
      },
    }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ size, color }) => <Ionicons name="home" color={color} size={30} />,
        }}
      />
      <Tabs.Screen
        name="videos"
        options={{
          tabBarIcon: ({ size, color }) => <Ionicons name="videocam" color={color} size={30} />,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          tabBarIcon: ({ size, color }) => <Ionicons name="cart" color={color} size={30} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ size, color }) => <Ionicons name="notifications" color={color} size={30} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ size, color }) => <Ionicons name="person-circle" color={color} size={30} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          tabBarIcon: ({ size, color }) => <Ionicons name="menu" color={color} size={30} />,
        }}
      />
    </Tabs>
  )
}