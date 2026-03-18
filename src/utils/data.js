// Sample wildlife data for the Wildlife Explorer application
const wildlifeData = {
    species: [
        {
            id: 1,
            name: "African Elephant",
            scientificName: "Loxodonta africana",
            category: "mammals",
            status: "endangered",
            habitat: "Savanna, Forest",
            location: "Africa",
            description: "The African elephant is the largest land animal on Earth. These gentle giants are known for their intelligence, strong family bonds, and excellent memory.",
            diet: "Herbivore",
            weight: "6,000 kg",
            lifespan: "60-70 years",
            image: "https://via.placeholder.com/400x300/4ade80/ffffff?text=African+Elephant",
            threats: ["Habitat loss", "Poaching", "Human-wildlife conflict"],
            conservation: "Protected under CITES Appendix I"
        },
        {
            id: 2,
            name: "Bengal Tiger",
            scientificName: "Panthera tigris tigris",
            category: "mammals",
            status: "endangered",
            habitat: "Forest, Grassland",
            location: "India, Bangladesh, Nepal",
            description: "The Bengal tiger is one of the most iconic big cats, known for its distinctive orange coat with black stripes.",
            diet: "Carnivore",
            weight: "220 kg",
            lifespan: "10-15 years",
            image: "https://via.placeholder.com/400x300/f97316/ffffff?text=Bengal+Tiger",
            threats: ["Habitat fragmentation", "Poaching", "Prey depletion"],
            conservation: "Protected under CITES Appendix I"
        },
        {
            id: 3,
            name: "Blue Whale",
            scientificName: "Balaenoptera musculus",
            category: "mammals",
            status: "endangered",
            habitat: "Ocean",
            location: "All oceans",
            description: "The blue whale is the largest animal ever known to have lived on Earth, reaching lengths of up to 30 meters.",
            diet: "Carnivore (krill)",
            weight: "200,000 kg",
            lifespan: "80-90 years",
            image: "https://via.placeholder.com/400x300/3b82f6/ffffff?text=Blue+Whale",
            threats: ["Ship strikes", "Entanglement", "Ocean noise"],
            conservation: "Protected under various international agreements"
        },
        {
            id: 4,
            name: "Giant Panda",
            scientificName: "Ailuropoda melanoleuca",
            category: "mammals",
            status: "vulnerable",
            habitat: "Forest",
            location: "China",
            description: "Giant pandas are beloved for their distinctive black and white coloring and gentle nature.",
            diet: "Herbivore (bamboo)",
            weight: "100 kg",
            lifespan: "20 years",
            image: "https://via.placeholder.com/400x300/64748b/ffffff?text=Giant+Panda",
            threats: ["Habitat loss", "Low birth rate", "Bamboo die-offs"],
            conservation: "Conservation efforts have helped increase populations"
        },
        {
            id: 5,
            name: "Bald Eagle",
            scientificName: "Haliaeetus leucocephalus",
            category: "birds",
            status: "least-concern",
            habitat: "Forest, Wetland",
            location: "North America",
            description: "The bald eagle is a bird of prey and the national bird of the United States.",
            diet: "Carnivore (fish, small mammals)",
            weight: "6.5 kg",
            lifespan: "20-30 years",
            image: "https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Bald+Eagle",
            threats: ["Habitat destruction", "Lead poisoning", "Power line collisions"],
            conservation: "Success story - recovered from endangered status"
        },
        {
            id: 6,
            name: "Green Sea Turtle",
            scientificName: "Chelonia mydas",
            category: "reptiles",
            status: "endangered",
            habitat: "Ocean, Beach",
            location: "Tropical and subtropical waters worldwide",
            description: "Green sea turtles are one of the largest sea turtles and the only herbivorous species.",
            diet: "Herbivore (seagrass, algae)",
            weight: "160 kg",
            lifespan: "60-70 years",
            image: "https://via.placeholder.com/400x300/22c55e/ffffff?text=Green+Sea+Turtle",
            threats: ["Plastic pollution", "Habitat loss", "Climate change"],
            conservation: "Protected under various international laws"
        },
        {
            id: 7,
            name: "Monarch Butterfly",
            scientificName: "Danaus plexippus",
            category: "insects",
            status: "endangered",
            habitat: "Fields, Forest",
            location: "North America",
            description: "Monarch butterflies are known for their spectacular mass migration and distinctive orange and black wings.",
            diet: "Herbivore (milkweed)",
            weight: "0.5 grams",
            lifespan: "2-6 weeks (most generations), up to 8 months (migrating generation)",
            image: "https://via.placeholder.com/400x300/eab308/000000?text=Monarch+Butterfly",
            threats: ["Habitat loss", "Pesticide use", "Climate change"],
            conservation: "Conservation efforts focus on habitat protection"
        },
        {
            id: 8,
            name: "Red-eyed Tree Frog",
            scientificName: "Agalychnis callidryas",
            category: "amphibians",
            status: "least-concern",
            habitat: "Rainforest",
            location: "Central America",
            description: "Known for their vibrant red eyes and bright green bodies, these frogs are iconic rainforest inhabitants.",
            diet: "Carnivore (insects)",
            weight: "6-15 grams",
            lifespan: "5 years",
            image: "https://via.placeholder.com/400x300/ef4444/ffffff?text=Red-eyed+Tree+Frog",
            threats: ["Habitat destruction", "Climate change", "Pollution"],
            conservation: "Currently stable but monitoring needed"
        }
    ],
    
    categories: [
        { id: "mammals", name: "Mammals", count: 0 },
        { id: "birds", name: "Birds", count: 0 },
        { id: "reptiles", name: "Reptiles", count: 0 },
        { id: "amphibians", name: "Amphibians", count: 0 },
        { id: "fish", name: "Fish", count: 0 },
        { id: "insects", name: "Insects", count: 0 }
    ],
    
    conservationStatus: [
        { id: "critically-endangered", name: "Critically Endangered", color: "red" },
        { id: "endangered", name: "Endangered", color: "orange" },
        { id: "vulnerable", name: "Vulnerable", color: "yellow" },
        { id: "near-threatened", name: "Near Threatened", color: "yellow" },
        { id: "least-concern", name: "Least Concern", color: "green" }
    ],
    
    habitats: [
        { id: "forest", name: "Forest", description: "Dense woodland areas with abundant tree cover" },
        { id: "savanna", name: "Savanna", description: "Grasslands with scattered trees" },
        { id: "ocean", name: "Ocean", description: "Marine environments" },
        { id: "wetland", name: "Wetland", description: "Areas saturated with water" },
        { id: "desert", name: "Desert", description: "Arid regions with minimal precipitation" },
        { id: "mountain", name: "Mountain", description: "High elevation terrain" },
        { id: "rainforest", name: "Rainforest", description: "Tropical forests with high rainfall" },
        { id: "grassland", name: "Grassland", description: "Open areas dominated by grasses" }
    ]
};

// Helper functions for data manipulation
const DataUtils = {
    // Get all species
    getAllSpecies: () => wildlifeData.species,
    
    // Get species by category
    getSpeciesByCategory: (category) => {
        return wildlifeData.species.filter(species => species.category === category);
    },
    
    // Get species by conservation status
    getSpeciesByStatus: (status) => {
        return wildlifeData.species.filter(species => species.status === status);
    },
    
    // Search species by name or description
    searchSpecies: (query) => {
        const searchTerm = query.toLowerCase();
        return wildlifeData.species.filter(species => 
            species.name.toLowerCase().includes(searchTerm) ||
            species.scientificName.toLowerCase().includes(searchTerm) ||
            species.description.toLowerCase().includes(searchTerm) ||
            species.habitat.toLowerCase().includes(searchTerm)
        );
    },
    
    // Get species by ID
    getSpeciesById: (id) => {
        return wildlifeData.species.find(species => species.id === parseInt(id));
    },
    
    // Get conservation status counts
    getConservationCounts: () => {
        const counts = {};
        wildlifeData.conservationStatus.forEach(status => {
            counts[status.id] = wildlifeData.species.filter(species => species.status === status.id).length;
        });
        return counts;
    },
    
    // Update category counts
    updateCategoryCounts: () => {
        wildlifeData.categories.forEach(category => {
            category.count = wildlifeData.species.filter(species => species.category === category.id).length;
        });
        return wildlifeData.categories;
    }
};

// Initialize category counts
DataUtils.updateCategoryCounts();
