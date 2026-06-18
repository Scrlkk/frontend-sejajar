import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ClientData } from "@/data/mockData";

interface ClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ClientData, "client_id"> & { client_id?: number }) => void;
  client?: ClientData | null;
}

export function ClientsModal({
  isOpen,
  onClose,
  onSave,
  client,
}: ClientsModalProps) {
  const isEdit = !!client;

  const [clientName, setClientName] = React.useState(client?.client_name ?? "");
  const [companyName, setCompanyName] = React.useState(client?.company_name ?? "");
  const [contactEmail, setContactEmail] = React.useState(client?.contact_email ?? "");
  const [contactPhone, setContactPhone] = React.useState(client?.contact_phone ?? "");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!clientName.trim()) newErrors.client_name = "Client Name is required";
    if (!companyName.trim()) newErrors.company_name = "Company / Brand Name is required";
    
    if (!contactEmail.trim()) {
      newErrors.contact_email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(contactEmail)) {
      newErrors.contact_email = "Invalid email format";
    }

    if (!contactPhone.trim()) {
      newErrors.contact_phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      client_id: client?.client_id,
      client_name: clientName.trim(),
      company_name: companyName.trim(),
      contact_email: contactEmail.trim(),
      contact_phone: contactPhone.trim(),
      joinedDate: client?.joinedDate, // preserve joined date if editing
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-140 max-h-[90vh] flex flex-col rounded-2xl border border-gray-100 bg-white px-6 shadow-2xl outline-none">
        <DialogHeader className="shrink-0 pt-1">
          <DialogTitle className="text-xl font-bold text-gray-900">
            {isEdit ? "Edit Client" : "Add Client"}
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-1">
            {isEdit
              ? "Update your client details below."
              : "Complete the form below to register a new client."}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1.5 scrollbar-none">
            {/* Company Name / Brand */}
            <div className="space-y-1.5 flex flex-col">
              <Label htmlFor="company_name" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Company / Brand <span className="text-red-500">*</span>
              </Label>
              <Input
                id="company_name"
                placeholder="e.g. TechVision Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={`rounded-lg border-gray-200 bg-gray-50/50 py-2.5 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors ${
                  errors.company_name ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.company_name && (
                <p className="text-[11px] text-red-500 font-medium">{errors.company_name}</p>
              )}
            </div>

            {/* Client Name */}
            <div className="space-y-1.5 flex flex-col">
              <Label htmlFor="client_name" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Contact Person / Client Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="client_name"
                placeholder="e.g. John Vision"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className={`rounded-lg border-gray-200 bg-gray-50/50 py-2.5 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors ${
                  errors.client_name ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.client_name && (
                <p className="text-[11px] text-red-500 font-medium">{errors.client_name}</p>
              )}
            </div>

            {/* Contact Email & Contact Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 flex flex-col">
                <Label htmlFor="contact_email" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  placeholder="e.g. contact@client.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className={`rounded-lg border-gray-200 bg-gray-50/50 py-2.5 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors ${
                    errors.contact_email ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.contact_email && (
                  <p className="text-[11px] text-red-500 font-medium">{errors.contact_email}</p>
                )}
              </div>

              <div className="space-y-1.5 flex flex-col">
                <Label htmlFor="contact_phone" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact_phone"
                  placeholder="e.g. +62 812-3456-7890"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className={`rounded-lg border-gray-200 bg-gray-50/50 py-2.5 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors ${
                    errors.contact_phone ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.contact_phone && (
                  <p className="text-[11px] text-red-500 font-medium">{errors.contact_phone}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0 mt-2 pb-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-lg border-gray-200 hover:bg-gray-50 text-gray-755 px-5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-lg bg-red-800 hover:bg-red-900 text-white font-medium px-5 transition-all"
            >
              {isEdit ? "Save Changes" : "Register Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
