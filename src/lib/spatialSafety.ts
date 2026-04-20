export function validateSpatialSafety(script: string): { isValid: boolean, message?: string } {
    if (!script) return { isValid: true }; // Nothing to check if empty

    // In a physical layout, ensuring objects do not overlap is critical for attendee flow.
    // We simulate safety validation by checking for identical location vectors being set directly.
    
    // Find patterns like location=(1, 2, 3) or location = (0.0, 0.0, 0)
    const locationRegex = /location\s*=\s*\(([\d.-]+?),\s*([\d.-]+?),\s*([\d.-]+?)\)/g;
    let match;
    const locations = new Set<string>();
    
    while ((match = locationRegex.exec(script)) !== null) {
        // Normalize the coordinate string to avoid trivial formatting differences
        const coord = `${parseFloat(match[1])}_${parseFloat(match[2])}_${parseFloat(match[3])}`;
        if (locations.has(coord)) {
            return {
                isValid: false,
                message: "Overlap Error: Multiple objects share the exact same location. Resolve spatial overlapping to ensure safe attendee flow."
            };
        }
        locations.add(coord);
    }
    
    return { isValid: true };
}
