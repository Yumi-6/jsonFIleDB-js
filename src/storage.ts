import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

type FilterOperator = "=" | ">" | "<" | "!=";

export interface JsonObject {
  [key: string]: JsonValue;
}

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonValue[]
  | JsonObject;

interface Filter {
  field: string;
  operator: FilterOperator;
  value: JsonValue;
}

export class Storege {
  private name = "";
  private filters: Filter[] = [];
  private data: JsonObject[] = [];

  async collection(name: string): Promise<void> {
    this.name = name;
    this.filters = [];

    const file = `database/${name}.json`;

    if (!existsSync("database")) mkdirSync("database");

    if (!existsSync(file)) {
      this.data = [];
      writeFileSync(file, "[]", "utf-8");
      return;
    }

    const content = readFileSync(file, "utf-8");
    this.data = JSON.parse(content) as JsonObject[];
  }

  async insert(data: JsonObject): Promise<boolean> {
    if (!this.name) {
      throw new Error("No collection selected. Call collection(name) first.");
    }

    const file = `database/${this.name}.json`;

    if (!existsSync("database")) mkdirSync("database");

    if (existsSync(file)) {
      const content = readFileSync(file, "utf-8");
      this.data = JSON.parse(content) as JsonObject[];
    } else {
      this.data = [];
    }

    this.data.push(data);

    writeFileSync(file, JSON.stringify(this.data, null, 2), "utf-8");

    return true;
  }

  where(field: string, operator: FilterOperator, value: JsonValue): this {
    this.filters.push({ field, operator, value });

    return this;
  }

  get(): JsonObject[] {
    let result = this.data;

    for (const filter of this.filters) {
      result = result.filter((item) => this.matches(item, filter));
    }

    return result;
  }

  delete(): boolean {
    if (!this.name) {
      throw new Error("No collection selected. Call collection(name) first.");
    }

    const file = `database/${this.name}.json`;

    this.data = this.data.filter(
      (item) => !this.filters.every((filter) => this.matches(item, filter)),
    );

    writeFileSync(file, JSON.stringify(this.data, null, 2), "utf-8");

    return true;
  }

  private matches(item: JsonObject, filter: Filter): boolean {
    const itemValue = item[filter.field];

    switch (filter.operator) {
      case "=":
        return itemValue === filter.value;
      case "!=":
        return itemValue !== filter.value;
      case ">":
        return Number(itemValue) > Number(filter.value);
      case "<":
        return Number(itemValue) < Number(filter.value);
      default:
        return false;
    }
  }
}
