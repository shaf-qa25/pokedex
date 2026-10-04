import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Pressable,
  FlatList,
} from "react-native";

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: pokemonTypes[];
}

interface pokemonTypes {
  type: {
    name: string;
    url: string;
  };
}

// 🎨 Clean, modern type color mapping
const TYPE_COLORS: Record<
  string,
  { cardBg: string; headerBg: string; badgeBg: string; text: string; border: string }
> = {
  grass: { cardBg: "#f0fdf4", headerBg: "#16a34a", badgeBg: "#dcfce7", text: "#15803d", border: "#bbf7d0" },
  fire: { cardBg: "#fff7ed", headerBg: "#ea580c", badgeBg: "#ffedd5", text: "#c2410c", border: "#fed7aa" },
  water: { cardBg: "#f0f9ff", headerBg: "#0284c7", badgeBg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" },
  bug: { cardBg: "#fefce8", headerBg: "#ca8a04", badgeBg: "#fef9c3", text: "#a16207", border: "#fef08a" },
  normal: { cardBg: "#f8fafc", headerBg: "#64748b", badgeBg: "#f1f5f9", text: "#475569", border: "#e2e8f0" },
  poison: { cardBg: "#fdf4ff", headerBg: "#9333ea", badgeBg: "#fae8ff", text: "#7e22ce", border: "#f5d0fe" },
  electric: { cardBg: "#fefce8", headerBg: "#d97706", badgeBg: "#fef3c7", text: "#b45309", border: "#fde68a" },
  ground: { cardBg: "#fffbeb", headerBg: "#d97706", badgeBg: "#fef3c7", text: "#b45309", border: "#fde68a" },
  fairy: { cardBg: "#fdf2f8", headerBg: "#db2777", badgeBg: "#fce7f3", text: "#be185d", border: "#fbcfe8" },
  fighting: { cardBg: "#fff1f2", headerBg: "#e11d48", badgeBg: "#ffe4e6", text: "#be123c", border: "#fecdd3" },
  psychic: { cardBg: "#fdf2f8", headerBg: "#db2777", badgeBg: "#fce7f3", text: "#be185d", border: "#fbcfe8" },
  rock: { cardBg: "#fffbeb", headerBg: "#b45309", badgeBg: "#fef3c7", text: "#78350f", border: "#fde68a" },
  ghost: { cardBg: "#faf5ff", headerBg: "#7e22ce", badgeBg: "#f3e8ff", text: "#6b21a8", border: "#e9d5ff" },
  ice: { cardBg: "#ecfeff", headerBg: "#0891b2", badgeBg: "#cffafe", text: "#0e7490", border: "#a5f3fc" },
  dragon: { cardBg: "#f5f3ff", headerBg: "#7c3aed", badgeBg: "#ede9fe", text: "#6d28d9", border: "#ddd6fe" },
  dark: { cardBg: "#f8fafc", headerBg: "#334155", badgeBg: "#e2e8f0", text: "#1e293b", border: "#cbd5e1" },
  steel: { cardBg: "#f8fafc", headerBg: "#475569", badgeBg: "#e2e8f0", text: "#334155", border: "#cbd5e1" },
  flying: { cardBg: "#eef2ff", headerBg: "#4f46e5", badgeBg: "#e0e7ff", text: "#4338ca", border: "#c7d2fe" },
};

const DEFAULT_COLOR = {
  cardBg: "#ffffff",
  headerBg: "#1e293b",
  badgeBg: "#f1f5f9",
  text: "#334155",
  border: "#e2e8f0",
};

export default function Index() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=30");
      const data = await response.json();

      const detailPokemon = await Promise.all(
        data.results.map(async (p: any) => {
          const res = await fetch(p.url);
          const details = await res.json();
          return {
            name: p.name,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            types: details.types,
          };
        })
      );

      setPokemon(detailPokemon);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderPokemonCard = ({ item }: { item: Pokemon }) => {
    const primaryType = item.types?.[0]?.type?.name ?? "normal";
    const theme = TYPE_COLORS[primaryType] || DEFAULT_COLOR;

    return (
      <Link href={{ pathname: "/details", params: { name: item.name } }} asChild>
        <Pressable
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          {/* Top Header Banner */}
          <View style={[styles.cardHeaderBanner, { backgroundColor: theme.headerBg }]}>
            <Text style={styles.pokemonName}>{item.name}</Text>

            <View style={styles.badgeContainer}>
              {item.types?.map((t, index) => {
                const typeName = t.type.name;
                const badgeTheme = TYPE_COLORS[typeName] || DEFAULT_COLOR;

                return (
                  <View
                    key={index}
                    style={[
                      styles.typeBadge,
                      { backgroundColor: badgeTheme.badgeBg },
                    ]}
                  >
                    <Text style={[styles.typeText, { color: badgeTheme.text }]}>
                      {typeName}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Body Content */}
          <View style={styles.cardBody}>
            <View style={styles.imageRow}>
              <View style={styles.imageCard}>
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.spriteImage}
                    resizeMode="contain"
                  />
                ) : null}
                <Text style={styles.imageLabel}>Front</Text>
              </View>

              <View style={styles.imageCard}>
                {item.imageBack ? (
                  <Image
                    source={{ uri: item.imageBack }}
                    style={styles.spriteImage}
                    resizeMode="contain"
                  />
                ) : null}
                <Text style={styles.imageLabel}>Back</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Link>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pokédex</Text>
        <Text style={styles.headerSubtitle}>Showing 30 Pokémon</Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0284c7" />
          <Text style={styles.loadingText}>Fetching Pokémon...</Text>
        </View>
      ) : (
        <FlatList
          data={pokemon}
          renderItem={renderPokemonCard}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
    marginTop: 2,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center", // Fixed valid style property
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#475569",
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeaderBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  pokemonName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    textTransform: "capitalize",
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 14,
  },
  imageRow: {
    flexDirection: "row",
    gap: 12,
  },
  imageCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  spriteImage: {
    width: 96,
    height: 96,
  },
  imageLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },
});