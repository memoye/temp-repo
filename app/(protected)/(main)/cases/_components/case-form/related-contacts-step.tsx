"use client";

import { useState } from "react";
import { type Control, useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Users, Eye, Scale, UserCheck, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactForm } from "./contact-form";
import type { CaseFormValues } from "@/types/cases";

interface RelatedContactsStepProps {
  control: Control<any>;
  watch: any;
  className?: string;
}

const contactCategories = [
  {
    id: "relatedContacts",
    label: "Related Contacts",
    description: "Family members, friends, or other related individuals",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    id: "witnesses",
    label: "Witnesses",
    description: "Individuals who witnessed relevant events",
    icon: Eye,
    color: "bg-green-500",
  },
  {
    id: "opposingParties",
    label: "Opposing Parties",
    description: "Parties on the opposing side of the case",
    icon: Scale,
    color: "bg-red-500",
  },
  {
    id: "experts",
    label: "Expert Witnesses",
    description: "Professional experts providing testimony",
    icon: UserCheck,
    color: "bg-purple-500",
  },
  {
    id: "otherContacts",
    label: "Other Contacts",
    description: "Additional contacts relevant to the case",
    icon: MoreHorizontal,
    color: "bg-gray-500",
  },
] as const;

const defaultContact = {
  name: "",
  email: "",
  phoneNumber: "",
  dialCode: "+1",
  contactId: "",
  relationship: "",
  contactType: 1,
  isExisting: false,
  existingContactId: "",
};

export function RelatedContactsStep({ control, watch, className }: RelatedContactsStepProps) {
  const [activeTab, setActiveTab] = useState("relatedContacts");
  const { setValue } = useFormContext<CaseFormValues>();

  const relatedContactsArray = useFieldArray({
    control,
    name: "contacts.relatedContacts",
  });

  const witnessesArray = useFieldArray({
    control,
    name: "contacts.witnesses",
  });

  const opposingPartiesArray = useFieldArray({
    control,
    name: "contacts.opposingParties",
  });

  const expertsArray = useFieldArray({
    control,
    name: "contacts.experts",
  });

  const otherContactsArray = useFieldArray({
    control,
    name: "contacts.otherContacts",
  });

  const getFieldArrayForCategory = (categoryId: string) => {
    switch (categoryId) {
      case "relatedContacts":
        return relatedContactsArray;
      case "witnesses":
        return witnessesArray;
      case "opposingParties":
        return opposingPartiesArray;
      case "experts":
        return expertsArray;
      case "otherContacts":
        return otherContactsArray;
      default:
        return relatedContactsArray;
    }
  };

  const ContactSection = ({ categoryId }: { categoryId: string }) => {
    const category = contactCategories.find((cat) => cat.id === categoryId);
    if (!category) return null;

    const Icon = category.icon;
    const fieldArray = getFieldArrayForCategory(categoryId);
    const fieldName = `contacts.${categoryId}`;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${category.color} text-white`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">{category.label}</h3>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </div>
          </div>
          <Badge variant="secondary">{fieldArray.fields.length}</Badge>
        </div>

        {fieldArray.fields.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Icon className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="mb-4 text-sm text-muted-foreground">
                No {category.label.toLowerCase()} added yet
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fieldArray.append(defaultContact)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add {category.label.slice(0, -1)}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {fieldArray.fields.map((field, index) => (
              <ContactForm
                key={field.id}
                control={control}
                watch={watch}
                fieldName={fieldName}
                index={index}
                onRemove={() => fieldArray.remove(index)}
                title={`${category.label.slice(0, -1)} ${index + 1}`}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => fieldArray.append(defaultContact)}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another {category.label.slice(0, -1)}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Add contacts related to this case. You can either select from existing contacts or add
        new ones. Organize them by category using the tabs below.
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {contactCategories.map((category) => {
            const Icon = category.icon;
            const fieldArray = getFieldArrayForCategory(category.id);
            const contactCount = fieldArray.fields.length;

            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-2 text-xs"
              >
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{category.label.split(" ")[0]}</span>
                {contactCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                    {contactCount}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {contactCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <ContactSection categoryId={category.id} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
