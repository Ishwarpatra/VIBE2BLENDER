import { describe, it, expect } from 'vitest';
import { validateSpatialSafety } from './spatialSafety';

describe('validateSpatialSafety', () => {
    it('should pass cleanly for empty scripts', () => {
        expect(validateSpatialSafety('').isValid).toBe(true);
    });

    it('should pass for scripts with no locations', () => {
        const script = `
import bpy
bpy.ops.mesh.primitive_cube_add()
        `;
        expect(validateSpatialSafety(script).isValid).toBe(true);
    });

    it('should pass if locations are unique', () => {
        const script = `
import bpy
obj1.location = (0, 0, 0)
obj2.location = (2, 0, 0)
obj3.location = (0, 5.5, 2.1)
        `;
        expect(validateSpatialSafety(script).isValid).toBe(true);
    });

    it('should return overlap error if identical locations exist', () => {
        const script = `
import bpy
desk1.location = (0, 0, 0)
desk2.location = (2, 0, 0)
cam.location = (2, 0, 0)
        `;
        const result = validateSpatialSafety(script);
        expect(result.isValid).toBe(false);
        expect(result.message).toMatch(/Overlap Error/);
    });

    it('should normalize coordinates properly', () => {
        const script = `
import bpy
obj1.location = (0, 0, 0)
obj2.location = (0.0, 0.0, 0.0)
        `;
        const result = validateSpatialSafety(script);
        expect(result.isValid).toBe(false);
    });
});
