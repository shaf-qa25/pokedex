import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTintColor: "#0f172a",
        headerTitleStyle: {
          fontWeight: "700",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // Index me custom header setup h isliye native layout header hide kiya
        }}
      />

      <Stack.Screen
        name="details"
        options={({ route }: any) => ({
          title: route.params?.name
            ? route.params.name.charAt(0).toUpperCase() + route.params.name.slice(1)
            : "Details",
          headerBackButtonDisplayMode: "minimal",
          headerBackTitle: "",
        })}
      />
    </Stack>
  );
}