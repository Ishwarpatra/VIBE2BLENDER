import { describe, it, expect } from 'vitest';
import { cleanPythonScript } from './scriptUtils';

describe('cleanPythonScript', () => {
  it('should remove ```python and trailing ```', () => {
    const raw = "```python\nimport bpy\n```";
    expect(cleanPythonScript(raw)).toBe("import bpy");
  });

  it('should remove ```py and trailing ```', () => {
    const raw = "```py\nprint('hello')\n```";
    expect(cleanPythonScript(raw)).toBe("print('hello')");
  });

  it('should remove plain ``` and trailing ```', () => {
    const raw = "```\ndef run(): pass\n```";
    expect(cleanPythonScript(raw)).toBe("def run(): pass");
  });

  it('should return pure code untouched', () => {
    const raw = "import bpy\nbpy.ops.mesh.primitive_cube_add()";
    expect(cleanPythonScript(raw)).toBe("import bpy\nbpy.ops.mesh.primitive_cube_add()");
  });

  it('should handle empty or null inputs', () => {
    expect(cleanPythonScript('')).toBe('');
    // @ts-ignore testing edge cases
    expect(cleanPythonScript(null)).toBe('');
  });
});
