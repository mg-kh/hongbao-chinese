"use client";

import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import { Stack } from "@mantine/core";
import { FormProvider } from "react-hook-form";
import FormFooter from "./components/FormFooter/FormFooter";
import QuestionSection from "./components/QuestionSection/QuestionSection";
import QuestionTypeSelector from "./components/QuestionTypeSelector/QuestionTypeSelector";
import useContainer from "./useContainer";

const QuestionEngineEditor = () => {
  const { form, handleFormSubmit, isLoading } = useContainer();
  return (
    <Stack className="h-[calc(100vh-60px)]">
      {isLoading ? (
        <LoaderComponent />
      ) : (
        <FormProvider {...form}>
          <form onSubmit={handleFormSubmit} id="question-form">
            <Stack className="flex-1">
              <QuestionTypeSelector />
              <QuestionSection />
            </Stack>
            <FormFooter />
          </form>
        </FormProvider>
      )}
    </Stack>
  );
};

export default QuestionEngineEditor;
