import {
  type DduItem,
  type SourceOptions,
} from "jsr:@shougo/ddu-vim@~6.1.0/types";
import { BaseFilter } from "jsr:@shougo/ddu-vim@~6.1.0/filter";
import { treePath2Filename } from "jsr:@shougo/ddu-vim@~6.1.0/utils";

import { type ActionData } from "jsr:@shougo/ddu-kind-file@~0.9.0";

import type { Denops } from "jsr:@denops/core@~7.0.0";
import * as fn from "jsr:@denops/std@~7.1.1/function";

import { relative } from "jsr:@std/path@~1.0.3/relative";

type Params = Record<string, never>;

export class Filter extends BaseFilter<Params> {
  override async filter(args: {
    denops: Denops;
    sourceOptions: SourceOptions;
    input: string;
    items: DduItem[];
  }): Promise<DduItem[]> {
    const basePath = args.sourceOptions.path.length != 0
      ? treePath2Filename(args.sourceOptions.path)
      : await fn.getcwd(args.denops) as string;
    return Promise.resolve(args.items.filter(
      (item) => {
        const action = item.action as ActionData;
        if (!action.path) return false;
        const relativePath = relative(basePath, action.path);
        return relativePath != action.path && !relativePath.startsWith("..");
      },
    ));
  }

  override params(): Params {
    return {};
  }
}
