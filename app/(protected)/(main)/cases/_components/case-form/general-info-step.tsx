"use client";

import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { BasicEditor } from "@/components/editor/basic";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/_combobox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multiselect";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CaseFormValues } from "@/types/cases";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

export function GeneralInfoStep() {
  const { control } = useFormContext<CaseFormValues>();

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

      <div className="grid items-start gap-x-6 gap-y-4 @2xl/page:grid-cols-2 [&_input]:bg-transparent">
        <FormField
          control={control}
          name="generalInfo.client"
          render={({ field: _, fieldState }) => (
            <FormItem className="w-full">
              <FormLabel htmlFor="client">Client</FormLabel>
              <FormControl>
                <Combobox
                  id="client"
                  options={[]}
                  onValueChange={(value) => {
                    console.log(value);
                  }}
                  placeholder="Select client"
                  searchPlaceholder="Search client"
                  optionsFooter={"Something.."}
                  hasError={fieldState.invalid}
                />
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
                <Input placeholder="Enter file number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="generalInfo.state"
          render={({ field: _, fieldState }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Combobox
                  id="client"
                  options={[]}
                  onValueChange={(value) => {
                    console.log(value);
                  }}
                  placeholder="Select State"
                  searchPlaceholder="Search State"
                  optionsFooter={"Something.."}
                  hasError={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="generalInfo.fileNumber"
          render={({ field: _, fieldState }) => (
            <FormItem>
              <FormLabel>Court</FormLabel>
              <FormControl>
                <MultiSelect
                  inputProps={{ id: "client" }}
                  onChange={(options) => console.log(options)}
                  options={
                    [
                      // Client options
                    ]
                  }
                  placeholder="Select client"
                  hidePlaceholderWhenSelected
                  emptyIndicator={
                    <div className="text-sm text-muted-foreground">No options!</div>
                  }
                  loadingIndicator={
                    <div className="text-sm text-muted-foreground">Loading...</div>
                  }
                  maxSelected={1}
                  hideClearAllButton
                  hasError={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="generalInfo.originatingLawyers"
          render={({ field: _, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="originatingLawyers">Originating Solicitors</FormLabel>
              <FormControl>
                <MultiSelect
                  inputProps={{ id: "originatingLawyers" }}
                  onChange={(options) => console.log(options)}
                  options={[]}
                  placeholder="Select Solicitors"
                  hidePlaceholderWhenSelected
                  emptyIndicator={
                    <div className="text-sm text-muted-foreground">No suggestions!</div>
                  }
                  hasError={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="generalInfo.responsibleLawyers"
          render={({ field: _, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="responsibleLawyers">Responsible Solicitors</FormLabel>
              <FormControl>
                <Combobox
                  id="responsibleLawyers"
                  options={[]}
                  onValueChange={(value) => {
                    console.log(value);
                  }}
                  hasError={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="generalInfo.practiceArea"
          render={({ field: _, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="practiceArea">Practice Area</FormLabel>
              <FormControl>
                <Combobox
                  id="practiceArea"
                  options={[]}
                  onValueChange={(value) => {
                    console.log(value);
                  }}
                  hasError={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="generalInfo.status"
          render={({ field: _, fieldState }) => (
            <FormItem>
              <FormLabel>Case Stage</FormLabel>
              <Select
              // onValueChange={field.onChange}
              // defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      fieldState.invalid ? "border-destructive" : "border-input",
                    )}
                  >
                    <SelectValue placeholder="Select a case type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="civil">stage 1</SelectItem>
                  <SelectItem value="criminal">stage 2</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="generalInfo.openDate"
          render={({ field, fieldState }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "h-10 w-full min-w-[200px] border pl-3 text-left font-normal dark:bg-input/30",
                        fieldState.invalid ? "border-destructive" : "border-input",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="generalInfo.closedDate"
          render={({ field, fieldState }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "h-10 w-full min-w-[200px] border pl-3 text-left font-normal dark:bg-input/30",
                        fieldState.invalid ? "border-destructive" : "border-input",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="generalInfo.nextCourtDate"
          render={({ field, fieldState }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Next Hearing</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "h-10 w-full min-w-[200px] border pl-3 text-left font-normal dark:bg-input/30",
                        fieldState.invalid ? "border-destructive" : "border-input",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
                }}
                hasError={fieldState.invalid}
                contentEditableClassName="max-h-[750px] min-h-52"
                maxLength={500}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
