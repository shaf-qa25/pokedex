import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    Image,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
} from "react-native";

interface PokemonDetail {
    id: number;
    name: string;
    height: number;
    weight: number;
    image: string;
    imageBack: string;
    types: { type: { name: string } }[];
    stats: { base_stat: number; stat: { name: string } }[];
    abilities: { ability: { name: string } }[];
}

// 🎨 Type Theme Color Palette
const TYPE_COLORS: Record<
    string,
    { cardBg: string; headerBg: string; badgeBg: string; text: string; border: string }
> = {
    grass: { cardBg: "#f0fdf4", headerBg: "#15803d", badgeBg: "#dcfce7", text: "#14532d", border: "#86efac" },
    fire: { cardBg: "#fff7ed", headerBg: "#c2410c", badgeBg: "#ffedd5", text: "#7c2d12", border: "#fdba74" },
    water: { cardBg: "#f0f9ff", headerBg: "#0369a1", badgeBg: "#e0f2fe", text: "#0c4a6e", border: "#7dd3fc" },
    bug: { cardBg: "#fefce8", headerBg: "#854d0e", badgeBg: "#fef9c3", text: "#713f12", border: "#fde047" },
    normal: { cardBg: "#f8fafc", headerBg: "#475569", badgeBg: "#e2e8f0", text: "#0f172a", border: "#cbd5e1" },
    poison: { cardBg: "#fdf4ff", headerBg: "#86198f", badgeBg: "#fae8ff", text: "#701a75", border: "#f0abfc" },
    electric: { cardBg: "#fefce8", headerBg: "#a16207", badgeBg: "#fef08a", text: "#713f12", border: "#fde047" },
    ground: { cardBg: "#fffbeb", headerBg: "#b45309", badgeBg: "#fef3c7", text: "#78350f", border: "#fcd34d" },
    fairy: { cardBg: "#fdf2f8", headerBg: "#be185d", badgeBg: "#fce7f3", text: "#831843", border: "#fbcfe8" },
    fighting: { cardBg: "#fff1f2", headerBg: "#be123c", badgeBg: "#ffe4e6", text: "#881337", border: "#fda4af" },
    psychic: { cardBg: "#fdf2f8", headerBg: "#9d174d", badgeBg: "#fce7f3", text: "#831843", border: "#fbcfe8" },
    rock: { cardBg: "#fffbeb", headerBg: "#78350f", badgeBg: "#fef3c7", text: "#451a03", border: "#fcd34d" },
    ghost: { cardBg: "#faf5ff", headerBg: "#6b21a8", badgeBg: "#f3e8ff", text: "#581c87", border: "#d8b4fe" },
    ice: { cardBg: "#ecfeff", headerBg: "#0e7490", badgeBg: "#cffafe", text: "#164e63", border: "#67e8f9" },
    dragon: { cardBg: "#f5f3ff", headerBg: "#5b21b6", badgeBg: "#ede9fe", text: "#4c1d95", border: "#c4b5fd" },
    dark: { cardBg: "#f1f5f9", headerBg: "#1e293b", badgeBg: "#cbd5e1", text: "#020617", border: "#94a3b8" },
    steel: { cardBg: "#f8fafc", headerBg: "#334155", badgeBg: "#e2e8f0", text: "#0f172a", border: "#cbd5e1" },
    flying: { cardBg: "#eef2ff", headerBg: "#3730a3", badgeBg: "#e0e7ff", text: "#312e81", border: "#a5b4fc" },
};

const DEFAULT_COLOR = {
    cardBg: "#ffffff",
    headerBg: "#0f172a",
    badgeBg: "#e2e8f0",
    text: "#0f172a",
    border: "#cbd5e1",
};

export default function Details() {
    const params = useLocalSearchParams();
    const pokemonName = params.name as string;

    const [details, setDetails] = useState<PokemonDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (pokemonName) {
            fetchDetails();
        }
    }, [pokemonName]);

    const fetchDetails = async () => {
        try {
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
            );
            const data = await response.json();

            setDetails({
                id: data.id,
                name: data.name,
                height: data.height,
                weight: data.weight,
                image:
                    data.sprites.other?.["official-artwork"]?.front_default ||
                    data.sprites.front_default,
                imageBack: data.sprites.back_default,
                types: data.types,
                stats: data.stats,
                abilities: data.abilities,
            });
        } catch (error) {
            console.log("Error fetching details:", error);
        } finally {
            setLoading(false);
        }
    };

    const primaryType = details?.types?.[0]?.type?.name ?? "normal";
    const theme = TYPE_COLORS[primaryType] || DEFAULT_COLOR;

    if (loading) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0369a1" />
                <Text style={styles.loadingText}>Loading Details...</Text>
            </SafeAreaView>
        );
    }

    if (!details) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <Text style={styles.errorText}>Failed to load Pokémon details.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={theme.headerBg} barStyle="light-content" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Main Card */}
                <View
                    style={[
                        styles.mainCard,
                        { backgroundColor: theme.cardBg, borderColor: theme.border },
                    ]}
                >
                    {/* Header Banner */}
                    <View style={[styles.cardHeader, { backgroundColor: theme.headerBg }]}>
                        <Text style={styles.idBadge}>
                            #{String(details.id).padStart(3, "0")}
                        </Text>
                        <Text style={styles.pokemonTitle}>{details.name}</Text>

                        <View style={styles.badgeRow}>
                            {details.types.map((t, index) => {
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
                        {/* Main Sprite */}
                        <View style={styles.imageWrapper}>
                            <Image
                                source={{ uri: details.image }}
                                style={styles.heroImage}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Height & Weight Metrics */}
                        <View style={styles.metricsContainer}>
                            <View style={styles.metricBox}>
                                <Text style={styles.metricValue}>
                                    {(details.height / 10).toFixed(1)} m
                                </Text>
                                <Text style={styles.metricLabel}>Height</Text>
                            </View>

                            <View style={styles.metricDivider} />

                            <View style={styles.metricBox}>
                                <Text style={styles.metricValue}>
                                    {(details.weight / 10).toFixed(1)} kg
                                </Text>
                                <Text style={styles.metricLabel}>Weight</Text>
                            </View>
                        </View>

                        {/* Base Stats Bar Chart */}
                        <Text style={styles.sectionTitle}>Base Stats</Text>
                        <View style={styles.statsContainer}>
                            {details.stats.map((item, index) => {
                                const statRatio = Math.min(item.base_stat / 150, 1);
                                return (
                                    <View key={index} style={styles.statRow}>
                                        <Text style={styles.statName}>{item.stat.name}</Text>
                                        <Text style={styles.statValue}>{item.base_stat}</Text>
                                        <View style={styles.statBarTrack}>
                                            <View
                                                style={[
                                                    styles.statBarFill,
                                                    {
                                                        width: `${statRatio * 100}%`,
                                                        backgroundColor: theme.headerBg,
                                                    },
                                                ]}
                                            />
                                        </View>
                                    </View>
                                );
                            })}
                        </View>

                        {/* Abilities */}
                        <Text style={styles.sectionTitle}>Abilities</Text>
                        <View style={styles.abilitiesContainer}>
                            {details.abilities.map((item, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.abilityChip,
                                        { backgroundColor: theme.badgeBg },
                                    ]}
                                >
                                    <Text style={[styles.abilityText, { color: theme.text }]}>
                                        {item.ability.name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#cbd5e1",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#cbd5e1",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "600",
        color: "#334155",
    },
    errorText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#be123c",
    },
    scrollContent: {
        padding: 16,
    },
    mainCard: {
        borderRadius: 24,
        borderWidth: 1,
        overflow: "hidden",
        elevation: 4,
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    cardHeader: {
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    idBadge: {
        fontSize: 14,
        fontWeight: "800",
        color: "rgba(255, 255, 255, 0.75)",
        letterSpacing: 1,
    },
    pokemonTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: "#ffffff",
        textTransform: "capitalize",
        marginVertical: 4,
    },
    badgeRow: {
        flexDirection: "row",
        gap: 8,
        marginTop: 6,
    },
    typeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeText: {
        fontSize: 12,
        fontWeight: "700",
        textTransform: "uppercase",
    },
    cardBody: {
        padding: 20,
    },
    imageWrapper: {
        alignItems: "center",
        marginVertical: 8,
    },
    heroImage: {
        width: 180,
        height: 180,
    },
    metricsContainer: {
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderRadius: 16,
        paddingVertical: 14,
        marginVertical: 16,
        alignItems: "center",
    },
    metricBox: {
        flex: 1,
        alignItems: "center",
    },
    metricValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#0f172a",
    },
    metricLabel: {
        fontSize: 12,
        color: "#64748b",
        marginTop: 2,
    },
    metricDivider: {
        width: 1,
        height: "60%",
        backgroundColor: "#e2e8f0",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#0f172a",
        marginTop: 12,
        marginBottom: 10,
    },
    statsContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 14,
        gap: 10,
    },
    statRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    statName: {
        width: 100,
        fontSize: 13,
        fontWeight: "600",
        color: "#475569",
        textTransform: "capitalize",
    },
    statValue: {
        width: 36,
        fontSize: 13,
        fontWeight: "700",
        color: "#0f172a",
        textAlign: "right",
        marginRight: 10,
    },
    statBarTrack: {
        flex: 1,
        height: 8,
        backgroundColor: "#f1f5f9",
        borderRadius: 4,
        overflow: "hidden",
    },
    statBarFill: {
        height: "100%",
        borderRadius: 4,
    },
    abilitiesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    abilityChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
    },
    abilityText: {
        fontSize: 13,
        fontWeight: "600",
        textTransform: "capitalize",
    },
});