import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "native-base";
import { Platform } from "react-native";

import { PlusCircle, SoccerBall } from 'phosphor-react-native'
import { CreatePoll } from "../screens/CreatePoll";
import { Polls } from "../screens/Polls";
import { SearchPoll } from "../screens/SearchPoll";
import { PollDetails } from "../screens/PollDetails";

const { Navigator, Screen } = createBottomTabNavigator()

export function AppRoutes() {
  const { colors, sizes } = useTheme()

  const size = sizes[6]

  return (
    <Navigator screenOptions={{
      headerShown: false,
      tabBarLabelPosition: 'beside-icon',
      tabBarActiveTintColor: colors.yellow[500],
      tabBarInactiveTintColor: colors.gray[300],
      tabBarStyle: {
        position: 'absolute',
        borderTopWidth: 0,
        backgroundColor: colors.gray[800]
      },
      tabBarItemStyle: {
        position: 'relative',
      }
    }}>
      <Screen
        name="createPoll"
        component={CreatePoll}
        options={{
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={size}/>,
          tabBarLabel: 'Novo Bolão'
        }}
      />

      <Screen
        name="polls"
        component={Polls}
        options={{
          tabBarIcon: ({ color }) => <SoccerBall color={color} size={size}/>,
          tabBarLabel: 'Meus Bolões'
        }}
      />

      <Screen
        name="searchPoll"
        component={SearchPoll}
        options={{ tabBarButton: () => null }}
      />
      
      <Screen
        name="pollDetails"
        component={PollDetails}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  )
}