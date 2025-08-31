import type { DduItem, SourceOptions } from "@shougo/ddu-vim/types";
import { BaseFilter } from "@shougo/ddu-vim/filter";
import { treePath2Filename } from "@shougo/ddu-vim/utils";

import type { ActionData } from "@shougo/ddu-kind-file";

import type { Denops } from "@denops/std";
import * as fn from "@denops/std/function";

import { relative } from "@std/path/relative";

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
