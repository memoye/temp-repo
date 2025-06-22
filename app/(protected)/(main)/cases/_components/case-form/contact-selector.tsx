"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, User, Building, Phone, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dialCode: string;
  contactType: number;
  organization?: string;
  lastInteraction?: string;
}

interface ContactSelectorProps {
  onSelect: (contact: Contact) => void;
  selectedContactId?: string;
  className?: string;
}

export function ContactSelector({
  onSelect,
  selectedContactId,
  className,
}: ContactSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch contacts from backend
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/contacts?search=${encodeURIComponent(searchQuery)}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }
        const data = await response.json();
        setContacts(data.contacts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load contacts");
        // Mock data for development
        setContacts([
          {
            id: "1",
            name: "John Smith",
            email: "john.smith@email.com",
            phoneNumber: "555-0123",
            dialCode: "+1",
            contactType: 1,
            organization: "Smith & Associates",
            lastInteraction: "2024-01-15",
          },
          {
            id: "2",
            name: "Sarah Johnson",
            email: "sarah.j@email.com",
            phoneNumber: "555-0456",
            dialCode: "+1",
            contactType: 1,
            lastInteraction: "2024-01-10",
          },
          {
            id: "3",
            name: "ABC Corporation",
            email: "contact@abc-corp.com",
            phoneNumber: "555-0789",
            dialCode: "+1",
            contactType: 2,
            organization: "ABC Corporation",
            lastInteraction: "2024-01-08",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchContacts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;

    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.organization?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [contacts, searchQuery]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search contacts by name, email, or organization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <ScrollArea className="h-[400px] w-full">
        <div className="space-y-2">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                <p>{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setSearchQuery("")}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : filteredContacts.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                {searchQuery ? (
                  <p>No contacts found matching "{searchQuery}"</p>
                ) : (
                  <p>No contacts available</p>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredContacts.map((contact) => (
              <Card
                key={contact.id}
                className={cn(
                  "cursor-pointer transition-colors hover:bg-muted/50",
                  selectedContactId === contact.id && "bg-primary/5 ring-2 ring-primary",
                )}
                onClick={() => onSelect(contact)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        {contact.contactType === 2 ? (
                          <Building className="h-5 w-5 text-primary" />
                        ) : (
                          <User className="h-5 w-5 text-primary" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{contact.name}</h4>
                          {contact.contactType === 2 && (
                            <Badge variant="secondary" className="text-xs">
                              Organization
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {contact.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {contact.dialCode} {contact.phoneNumber}
                          </div>
                        </div>

                        {contact.organization && contact.contactType !== 2 && (
                          <p className="text-xs text-muted-foreground">
                            {contact.organization}
                          </p>
                        )}
                      </div>
                    </div>

                    {selectedContactId === contact.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
