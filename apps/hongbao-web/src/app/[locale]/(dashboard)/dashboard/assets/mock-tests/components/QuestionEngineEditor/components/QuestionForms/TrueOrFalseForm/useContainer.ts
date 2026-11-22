import { getTrueOrFalseOptions } from "@/app/[locale]/(dashboard)/dashboard/assets/mock-tests/components/QuestionEngineEditor/quiz-editor-schema";
import { TTrueOrFalseOption } from "@/utils/normalizeTrueOrFalse";
import { useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";

const useContainer = () => {
  const { control, setValue } = useFormContext();
  const watchedOptions: TTrueOrFalseOption[] | undefined = useWatch({
    control,
    name: "data.options",
  });
  const options = useMemo(() => watchedOptions ?? [], [watchedOptions]);

  // A loaded question without options still gets the fixed True / False pair.
  useEffect(() => {
    if (options.length === 0) {
      setValue("data.options", getTrueOrFalseOptions(), { shouldDirty: true });
    }
  }, [options.length, setValue]);

  return { control, options };
};

export default useContainer;
