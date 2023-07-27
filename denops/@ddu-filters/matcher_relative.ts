import {
  BaseFilter,
  DduItem,
  SourceOptions,
} from "https://deno.land/x/ddu_vim@v3.4.4/types.ts";
import { Denops, fn } from "https://deno.land/x/ddu_vim@v3.4.4/deps.ts";
import { ActionData } from "https://deno.land/x/ddu_kind_file@v0.5.3/file.ts";
import { relative } from "https://deno.land/std@0.196.0/path/mod.ts";
import { treePath2Filename } from "https://deno.land/x/ddu_vim@v3.4.4/utils.ts";

type Params = Record<never, never>;

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
