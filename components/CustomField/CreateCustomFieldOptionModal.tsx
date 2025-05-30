"use client";
import { secondaryBtnStyles, successBtnStyles } from "@/app/commonStyles";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useModalDialog } from "@/hooks/useModalDialog";
import { cn } from "@/lib/utils";
import React, { ReactElement } from "react";
import { CustomOptionForm } from "./CustomOptionForm";

interface Props {
  title: string;
  triggerLabel?: string;
  triggerBtn?: ReactElement<{ onClick?: () => void }>;
  handleSubmit?: (data: Omit<ICustomFieldData, "id">) => void;
  action?: "create-new-project" | "update-project";
}

export const CreateOrEditCustomFieldOptionModal = ({
  title,
  triggerLabel,
  triggerBtn,
  handleSubmit,
}: Props) => {
  const { isModalOpen, openModal, closeModal } = useModalDialog();

  const handleSubmitData = (data: Omit<ICustomFieldData, "id">) => {
    if (typeof handleSubmit === "function") {
      handleSubmit(data);
      closeModal();
    }
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(isOpen) => !isOpen && closeModal()}
    >
      <DialogTrigger asChild>
        {triggerBtn ? (
          React.cloneElement(triggerBtn, { onClick: openModal })
        ) : (
          <Button className={cn(successBtnStyles)} onClick={openModal}>
            {triggerLabel}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-96 max-h-[100vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Separator className="mb-4" />
        <CustomOptionForm
          onSubmit={(data) => handleSubmitData(data)}
          submitBtnLabel="Save"
          cancelButton={
            <Button className={cn(secondaryBtnStyles)} onClick={closeModal}>
              Cancel
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  );
};
