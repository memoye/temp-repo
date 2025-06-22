"use client";

import { useState } from "react";
import type { Control, UseFormWatch } from "react-hook-form";
import { UserPlus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactSelector } from "./contact-selector";
import type { CaseFormValues } from "@/types/cases";
import { useFormContext } from "react-hook-form";

const dialCodes = [
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "India" },
  // Add more dial codes as needed
];

const relationshipOptions = [
  "Client",
  "Partner",
  "Vendor",
  "Other",
  // Add more relationship options as needed
];

interface ContactFormProps {
  control: Control<CaseFormValues>;
  watch: UseFormWatch<CaseFormValues>;
  fieldName: string;
  index: number;
  onRemove: () => void;
  title: string;
}

export function ContactForm({
  control,
  watch,
  fieldName,
  index,
  onRemove,
  title,
}: ContactFormProps) {
  const { setValue } = useFormContext<CaseFormValues>();
  const [contactMode, setContactMode] = useState<"new" | "existing">("new");

  const watchedContact = watch(`${fieldName}.${index}` as any);
  const isExisting = watchedContact?.isExisting || false;

  const handleModeChange = (mode: "new" | "existing") => {
    setContactMode(mode);

    // Reset form fields when switching modes
    if (mode === "existing") {
      setValue(`${fieldName}.${index}.isExisting` as any, true);
      // Clear manual entry fields
      setValue(`${fieldName}.${index}.name` as any, "");
      setValue(`${fieldName}.${index}.email` as any, "");
      setValue(`${fieldName}.${index}.phoneNumber` as any, "");
      setValue(`${fieldName}.${index}.dialCode` as any, "+1");
    } else {
      setValue(`${fieldName}.${index}.isExisting` as any, false);
      setValue(`${fieldName}.${index}.existingContactId` as any, "");
    }
  };

  const handleExistingContactSelect = (contact: any) => {
    setValue(`${fieldName}.${index}.existingContactId` as any, contact.id);
    setValue(`${fieldName}.${index}.name` as any, contact.name);
    setValue(`${fieldName}.${index}.email` as any, contact.email);
    setValue(`${fieldName}.${index}.phoneNumber` as any, contact.phoneNumber);
    setValue(`${fieldName}.${index}.dialCode` as any, contact.dialCode);
    setValue(`${fieldName}.${index}.contactId` as any, contact.id);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contact Mode Selection */}
        <Tabs
          value={contactMode}
          onValueChange={(value) => handleModeChange(value as "new" | "existing")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add New Contact
            </TabsTrigger>
            <TabsTrigger value="existing" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Select Existing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="mt-4">
            <div className="space-y-4">
              <FormField
                control={control}
                name={`${fieldName}.${index}.existingContactId` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Contact</FormLabel>
                    <ContactSelector
                      onSelect={handleExistingContactSelect}
                      selectedContactId={field.value}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Show selected contact details */}
              {watchedContact?.name && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="mb-2 font-medium">Selected Contact</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Name:</strong> {watchedContact.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {watchedContact.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {watchedContact.dialCode}{" "}
                        {watchedContact.phoneNumber}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="new" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={control}
                  name={`${fieldName}.${index}.name` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`${fieldName}.${index}.email` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={control}
                  name={`${fieldName}.${index}.dialCode` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country Code *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select code" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dialCodes.map((dial) => (
                            <SelectItem key={dial.code} value={dial.code}>
                              {dial.code} ({dial.country})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`${fieldName}.${index}.phoneNumber` as any}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Common fields for both modes */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name={`${fieldName}.${index}.relationship` as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {relationshipOptions.map((relationship) => (
                      <SelectItem key={relationship} value={relationship}>
                        {relationship}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`${fieldName}.${index}.contactId` as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Auto-generated or custom ID"
                    {...field}
                    disabled={isExisting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
