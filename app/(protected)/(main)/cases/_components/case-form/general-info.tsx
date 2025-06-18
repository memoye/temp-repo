"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaseFormValues } from "@/types/cases";
import { BasicEditor } from "@/components/blocks/editor/basic";

export function GeneralInfoStep() {
  const { control, watch, setError } = useFormContext<CaseFormValues>();

  console.log(watch("generalInfo.description"), watch("generalInfo.description").length);

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="generalInfo.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Case Title</FormLabel>
            <FormControl>
              <Input placeholder="Smith v. Jones" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-x-6 gap-y-4 @3xl/caseForm:grid-cols-2 [&_input]:bg-transparent">
        <FormField
          control={control}
          name="generalInfo.client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <Input placeholder="Superior Court of California" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="generalInfo.fileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Number</FormLabel>
              <FormControl>
                <Input placeholder="2023-CV-12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="generalInfo.courtId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Jurisdiction</FormLabel>
            <FormControl>
              <Input placeholder="Superior Court of California" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="generalInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Case Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a case type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="civil">Civil</SelectItem>
                <SelectItem value="criminal">Criminal</SelectItem>
                <SelectItem value="family">Family Law</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="generalInfo.description"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <BasicEditor
                placeholder="Start typing..."
                editorSerializedState={field.value ? JSON.parse(field.value) : undefined}
                onSerializedChange={(state) => {
                  field.onChange(JSON.stringify(state));
                  // setError("generalInfo.description", {
                  //   message: "Max character limit reached",
                  // });
                }}
                hasError={fieldState.isDirty && fieldState.invalid}
                contentEditableClassName="max-h-[750px] min-h-52"
                maxLength={10}
                onLimitReached={() => {
                  console.log("yes");
                  setError("generalInfo.description", {
                    message: "Max character limit reached",
                    // type: "onChange",
                  });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
