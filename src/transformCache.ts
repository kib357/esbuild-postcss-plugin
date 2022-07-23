import fs from "fs/promises";

export class TransformCache {
  map = new Map();

  async getOrTransform<T>(
    filePath: string,
    transform: (input: string) => Promise<T>
  ): Promise<T> {
    const input = await fs.readFile(filePath, "utf8");
    let value = this.map.get(filePath);

    if (!value || value.input !== input) {
      const contents = await transform(input);
      value = { input, contents };
      this.map.set(filePath, value);
    }

    return value.contents;
  }
}

export class FakeCache {
  async getOrTransform<T>(
    filePath: string,
    transform: (input: string) => Promise<T>
  ): Promise<T> {
    const input = await fs.readFile(filePath, "utf8");
    return transform(input);
  }
}
