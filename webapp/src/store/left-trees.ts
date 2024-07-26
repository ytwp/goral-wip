import { StoreKey } from "@/constant";
import { LeftTree } from "@/types/query";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LeftTrees = {
  leftTrees: LeftTree[]
};

export type LeftTreesStore = LeftTrees & {
  update: (updater: (config: LeftTrees) => void) => void;
  updateCatelog: (catlogs: string[]) => void;
  updateSchema: (catlog: string, schemas: string[]) => void;
  updateTable: (catlog: string, schema: string, tables: string[]) => void;
};

export const useLeftTreesStore = create<LeftTreesStore>()(
  persist(
    (set, get) => ({
      leftTrees: [],

      update(updater) {
        const config = { ...get() };
        updater(config);
        set(() => config);
      },
      updateCatelog(catlogs: string[]) {
        const oldLeftTrees = get().leftTrees
        // Create a new array for the updated leftTrees
        let updatedLeftTrees: LeftTree[] = [];
        // Add items from catlogs that are not in oldLeftTrees
        catlogs.forEach(catlog => {
          if (!oldLeftTrees.some(tree => tree.name === catlog)) {
            updatedLeftTrees.push({ name: catlog });
          }
        });
        // Add items from oldLeftTrees that are in catlogs
        oldLeftTrees.forEach(tree => {
          if (catlogs.includes(tree.name)) {
            updatedLeftTrees.push(tree);
          }
        });
        // Update the state
        set(() => ({ leftTrees: updatedLeftTrees }));
      },
      updateSchema(catlog: string, schemas: string[]) {
        const leftTrees = get().leftTrees;
        // Find the tree that matches the given catlog
        const updatedLeftTrees = leftTrees.map(tree => {
          if (tree.name === catlog) {
            // Create a set of the new schemas for quick lookup
            const schemaSet = new Set(schemas);
            // Filter out children that are not in the new schemas
            const existingChildren = (tree.children || []).filter(child => schemaSet.has(child.name));
            // Add new schemas that are not already in the children
            const newChildren = schemas
              .filter(schema => !existingChildren.some(child => child.name === schema))
              .map(schema => ({ name: schema }));
            // Combine existing and new children
            const updatedChildren = [...existingChildren, ...newChildren];
            return { ...tree, children: updatedChildren };
          }
          return tree;
        });
        // Update the state
        set(() => ({ leftTrees: updatedLeftTrees }));
      },
      updateTable(catlog: string, schema: string, tables: string[]) {
        const leftTrees = get().leftTrees;
        // Find the tree that matches the given catlog
        const updatedLeftTrees = leftTrees.map(tree => {
          if (tree.name === catlog && tree.children) {
            // Find the schema within the children
            const updatedChildren = tree.children.map(child => {
              if (child.name === schema) {
                // Create a set of the new tables for quick lookup
                const tableSet = new Set(tables);
                // Filter out children that are not in the new tables
                const existingTables = (child.children || []).filter(table => tableSet.has(table.name));
                // Add new tables that are not already in the children
                const newTables = tables
                  .filter(table => !existingTables.some(existingTable => existingTable.name === table))
                  .map(table => ({ name: table }));
                // Combine existing and new tables
                const updatedTables = [...existingTables, ...newTables];
                return { ...child, children: updatedTables };
              }
              return child;
            });
            return { ...tree, children: updatedChildren };
          }
          return tree;
        });
        // Update the state
        set(() => ({ leftTrees: updatedLeftTrees }));
      },
    }),
    {
      name: StoreKey.LeftTrees,
      version: 1,
      migrate(persistedState, version) {
        const state = persistedState as LeftTrees;

        if (version < 1) {
          // merge your old config
        }

        return state as any;
      },
    },
  ),
);
