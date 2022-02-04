import { BaseFilter, DduItem, SourceOptions } from "https://deno.land/x/ddu_vim@v0.7.0/types.ts";
import { Denops, fn } from "https://deno.land/x/ddu_vim@v0.7.0/deps.ts";
import { ActionData } from "https://deno.land/x/ddu_kind_file@v0.1.0/file.ts#^";
import { relative } from "https://deno.land/std@0.125.0/path/mod.ts#^";

type Params = Record<never, never>;

export class Filter extends BaseFilter<Params> {
  async filter(args: {
    denops: Denops;
    sourceOptions: SourceOptions;
    input: string;
    items: DduItem[];
  }): Promise<DduItem[]> {
    const cwd = await fn.getcwd(args.denops) as string;
    return Promise.resolve(args.items.filter(
      (item) => {
        const action = item.action as ActionData;
        if (!action.path) { return false; }
        const relativePath = relative(cwd, action.path);
        return relativePath != action.path && !relativePath.startsWith("..");
      }
    ));
  }

  params(): Params {
    return {};
  }
}
